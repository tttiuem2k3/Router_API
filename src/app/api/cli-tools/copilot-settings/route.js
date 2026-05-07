"use server";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { getRoamingAppDataDir, joinHomePath, joinRuntimePath } from "../../../../lib/runtimePaths";

// Resolve chatLanguageModels.json path per OS
const getConfigPath = () => {
  const platform = os.platform();
  if (platform === "win32") {
    return joinRuntimePath(getRoamingAppDataDir(), "Code", "User", "chatLanguageModels.json");
  }
  if (platform === "darwin") {
    return joinHomePath("Library", "Application Support", "Code", "User", "chatLanguageModels.json");
  }
  return joinHomePath(".config", "Code", "User", "chatLanguageModels.json");
};

const readConfig = async () => {
  try {
    const content = await fs.readFile(getConfigPath(), "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
};

const hasTTTRouterAPIConfig = (config) => {
  if (!Array.isArray(config)) return false;
  return config.some((entry) => entry.name === "ttt_router");
};

const getTTTRouterAPIEntry = (config) => {
  if (!Array.isArray(config)) return null;
  return config.find((entry) => entry.name === "ttt_router") || null;
};

// GET - Read current copilot config
export async function GET() {
  try {
    const config = await readConfig();
    const entry = getTTTRouterAPIEntry(config);

    return NextResponse.json({
      installed: true,
      config,
      hasTTTRouterAPI: hasTTTRouterAPIConfig(config),
      configPath: getConfigPath(),
      currentModel: entry?.models?.[0]?.id || null,
      currentUrl: entry?.models?.[0]?.url || null,
    });
  } catch (error) {
    console.log("Error checking copilot settings:", error);
    return NextResponse.json({ error: "Failed to check copilot settings" }, { status: 500 });
  }
}

// POST - Apply TTT Router API config to chatLanguageModels.json
export async function POST(request) {
  try {
    const { baseUrl, apiKey, models } = await request.json();

    if (!baseUrl || !models?.length) {
      return NextResponse.json({ error: "baseUrl and models are required" }, { status: 400 });
    }

    const configPath = getConfigPath();
    await fs.mkdir(path.dirname(configPath), { recursive: true });

    // Read existing config array
    let config = [];
    try {
      const existing = await fs.readFile(configPath, "utf-8");
      const parsed = JSON.parse(existing);
      config = Array.isArray(parsed) ? parsed : [];
    } catch { /* No existing config */ }

    const endpointUrl = `${baseUrl}/chat/completions#models.ai.azure.com`;
    const keyToUse = apiKey || "sk_ttt_router";

    const newEntry = {
      name: "ttt_router",
      vendor: "azure",
      apiKey: keyToUse,
      models: models.map((id) => ({
        id,
        name: id,
        url: endpointUrl,
        toolCalling: true,
        vision: false,
        maxInputTokens: 128000,
        maxOutputTokens: 16000,
      })),
    };

    // Replace existing TTT Router API entry or append
    const idx = config.findIndex((e) => e.name === "ttt_router");
    if (idx >= 0) {
      config[idx] = newEntry;
    } else {
      config.push(newEntry);
    }

    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    return NextResponse.json({
      success: true,
      message: "Copilot settings applied! Reload VS Code to take effect.",
      configPath,
    });
  } catch (error) {
    console.log("Error updating copilot settings:", error);
    return NextResponse.json({ error: "Failed to update copilot settings" }, { status: 500 });
  }
}

// DELETE - Remove TTT Router API entry from chatLanguageModels.json
export async function DELETE() {
  try {
    const configPath = getConfigPath();

    let config = [];
    try {
      const existing = await fs.readFile(configPath, "utf-8");
      const parsed = JSON.parse(existing);
      config = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      if (error.code === "ENOENT") {
        return NextResponse.json({ success: true, message: "No config file to reset" });
      }
      throw error;
    }

    config = config.filter((e) => e.name !== "ttt_router");
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    return NextResponse.json({
      success: true,
      message: "TTT Router API removed from Copilot config",
    });
  } catch (error) {
    console.log("Error resetting copilot settings:", error);
    return NextResponse.json({ error: "Failed to reset copilot settings" }, { status: 500 });
  }
}

