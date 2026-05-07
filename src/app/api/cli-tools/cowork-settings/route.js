"use server";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import os from "os";
import crypto from "crypto";
import { getLocalAppDataDir, getRoamingAppDataDir, joinHomePath, joinRuntimePath } from "../../../../lib/runtimePaths";

const PROVIDER = "gateway";

// Candidate user-data roots — Cowork can run from either Claude-3p (3p mode) or Claude (1p mode w/ cowork features)
const getCandidateRoots = () => {
  if (os.platform() === "darwin") {
    const base = joinHomePath("Library", "Application Support");
    return [joinRuntimePath(base, "Claude-3p"), joinRuntimePath(base, "Claude")];
  }
  if (os.platform() === "win32") {
    const localApp = getLocalAppDataDir();
    const roaming = getRoamingAppDataDir();
    return [
      joinRuntimePath(localApp, "Claude-3p"),
      joinRuntimePath(roaming, "Claude-3p"),
      joinRuntimePath(localApp, "Claude"),
      joinRuntimePath(roaming, "Claude"),
    ];
  }
  return [
    joinHomePath(".config", "Claude-3p"),
    joinHomePath(".config", "Claude"),
  ];
};

// Claude.app/exe install paths — fallback detect when no user-data folder yet
const getAppInstallPaths = () => {
  if (os.platform() === "darwin") {
    return ["/Applications/Claude.app", joinHomePath("Applications", "Claude.app")];
  }
  if (os.platform() === "win32") {
    const localApp = getLocalAppDataDir();
    const programFiles = process.env["ProgramFiles"] || "C:\\Program Files";
    return [
      joinRuntimePath(localApp, "AnthropicClaude"),
      joinRuntimePath(programFiles, "Claude"),
      joinRuntimePath(programFiles, "AnthropicClaude"),
    ];
  }
  return [];
};

// For READ: prefer existing configLibrary (any root). For WRITE: always Claude-3p (first candidate).
const resolveAppRootForRead = async () => {
  const candidates = getCandidateRoots();
  for (const dir of candidates) {
    try {
      await fs.access(joinRuntimePath(dir, "configLibrary"));
      return dir;
    } catch { /* try next */ }
  }
  return candidates[0];
};

const getWriteRoot = () => getCandidateRoots()[0]; // always Claude-3p

const getConfigDir = async () => joinRuntimePath(await resolveAppRootForRead(), "configLibrary");
const getWriteConfigDir = () => joinRuntimePath(getWriteRoot(), "configLibrary");
const getMetaPath = async () => joinRuntimePath(await getConfigDir(), "_meta.json");
const getWriteMetaPath = () => joinRuntimePath(getWriteConfigDir(), "_meta.json");

// Locate Claude (1p) folder for claude_desktop_config.json bootstrap
const get1pRoot = () => {
  if (os.platform() === "darwin") {
    return joinHomePath("Library", "Application Support", "Claude");
  }
  if (os.platform() === "win32") {
    const roaming = getRoamingAppDataDir();
    return joinRuntimePath(roaming, "Claude"); // 1p uses roaming on Win
  }
  return joinHomePath(".config", "Claude");
};

// Set deploymentMode="3p" in Claude/claude_desktop_config.json (preserve existing keys)
const bootstrapDeploymentMode = async () => {
  const cfgPath = joinRuntimePath(get1pRoot(), "claude_desktop_config.json");
  let cfg = {};
  try {
    const content = await fs.readFile(cfgPath, "utf-8");
    cfg = JSON.parse(content);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (cfg.deploymentMode === "3p") return false; // no change
  cfg.deploymentMode = "3p";
  await fs.mkdir(get1pRoot(), { recursive: true });
  await fs.writeFile(cfgPath, JSON.stringify(cfg, null, 2));
  return true;
};

// Cowork is available if either (a) any user-data root exists or (b) Claude app is installed
const checkInstalled = async () => {
  for (const dir of [...getCandidateRoots(), ...getAppInstallPaths()]) {
    try {
      await fs.access(dir);
      return true;
    } catch { /* try next */ }
  }
  return false;
};

const isLocalhostUrl = (url) => /localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(url || "");

const readJson = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
};

// Ensure meta exists in Claude-3p/configLibrary (write target). If meta already exists in Claude/ (1p), copy appliedId.
const ensureMeta = async () => {
  const writeMetaPath = getWriteMetaPath();
  let meta = await readJson(writeMetaPath);
  if (!meta || !meta.appliedId) {
    // Try to inherit from any existing root
    const existingRead = await readJson(await getMetaPath());
    if (existingRead?.appliedId) {
      meta = existingRead;
    } else {
      const newId = crypto.randomUUID();
      meta = { appliedId: newId, entries: [{ id: newId, name: "Default" }] };
    }
    await fs.mkdir(getWriteConfigDir(), { recursive: true });
    await fs.writeFile(writeMetaPath, JSON.stringify(meta, null, 2));
  }
  return meta;
};

export async function GET() {
  try {
    const installed = await checkInstalled();
    if (!installed) {
      return NextResponse.json({
        installed: false,
        config: null,
        message: "Claude Desktop (Cowork mode) not detected",
      });
    }

    const meta = await readJson(await getMetaPath());
    const appliedId = meta?.appliedId || null;
    const configDir = await getConfigDir();
    const configPath = appliedId ? joinRuntimePath(configDir, `${appliedId}.json`) : null;
    const config = configPath ? await readJson(configPath) : null;

    const baseUrl = config?.inferenceGatewayBaseUrl || null;
    const models = Array.isArray(config?.inferenceModels)
      ? config.inferenceModels.map((m) => (typeof m === "string" ? m : m?.name)).filter(Boolean)
      : [];

    const hasTTTRouterAPI = !!(config?.inferenceProvider === PROVIDER && baseUrl);

    return NextResponse.json({
      installed: true,
      config,
      hasTTTRouterAPI,
      configPath,
      cowork: {
        appliedId,
        baseUrl,
        models,
        provider: config?.inferenceProvider || null,
      },
    });
  } catch (error) {
    console.log("Error reading cowork settings:", error);
    return NextResponse.json({ error: "Failed to read cowork settings" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { baseUrl, apiKey, models } = await request.json();

    if (!baseUrl || !apiKey) {
      return NextResponse.json({ error: "baseUrl and apiKey are required" }, { status: 400 });
    }

    if (isLocalhostUrl(baseUrl)) {
      return NextResponse.json({
        error: "Claude Cowork sandbox cannot reach localhost. Enable Tunnel/Cloud Endpoint or use Tailscale/VPS.",
      }, { status: 400 });
    }

    const modelsArray = Array.isArray(models) ? models.filter((m) => typeof m === "string" && m.trim()) : [];
    if (modelsArray.length === 0) {
      return NextResponse.json({ error: "At least one model is required" }, { status: 400 });
    }

    const bootstrapped = await bootstrapDeploymentMode();
    const meta = await ensureMeta();
    const configPath = joinRuntimePath(getWriteConfigDir(), `${meta.appliedId}.json`);

    const newConfig = {
      inferenceProvider: PROVIDER,
      inferenceGatewayBaseUrl: baseUrl,
      inferenceGatewayApiKey: apiKey,
      inferenceModels: modelsArray.map((name) => ({ name })),
    };

    await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2));

    return NextResponse.json({
      success: true,
      bootstrapped,
      message: bootstrapped
        ? "Cowork enabled (3p mode set). Quit & reopen Claude Desktop."
        : "Cowork settings applied. Quit & reopen Claude Desktop.",
      configPath,
    });
  } catch (error) {
    console.log("Error applying cowork settings:", error);
    return NextResponse.json({ error: "Failed to apply cowork settings" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const meta = await readJson(await getMetaPath());
    if (!meta?.appliedId) {
      return NextResponse.json({ success: true, message: "No active config to reset" });
    }
    const configPath = joinRuntimePath(await getConfigDir(), `${meta.appliedId}.json`);
    try {
      await fs.writeFile(configPath, JSON.stringify({}, null, 2));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    return NextResponse.json({ success: true, message: "Cowork config reset" });
  } catch (error) {
    console.log("Error resetting cowork settings:", error);
    return NextResponse.json({ error: "Failed to reset cowork settings" }, { status: 500 });
  }
}
