const path = require("path");
const os = require("os");

const getEnv = (name) => Reflect.get(process.env, name);
const joinPath = (...parts) => Reflect.get(path, "join").call(path, ...parts);
const getHomeDir = () => {
  const homeDrive = getEnv("HOMEDRIVE");
  const homePath = getEnv("HOMEPATH");
  return getEnv("USERPROFILE") || (homeDrive && homePath ? `${homeDrive}${homePath}` : "") || getEnv("HOME") || Reflect.get(os, "homedir").call(os);
};
const getRoamingAppDataDir = () => getEnv("APPDATA") || joinPath(getHomeDir(), "AppData", "Roaming");

// Single source of truth for data directory — matches localDb.js logic
function getDataDir() {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  if (process.platform === "win32") {
    return joinPath(getRoamingAppDataDir(), "ttt_router");
  }
  return joinPath(getHomeDir(), ".ttt_router");
}

const DATA_DIR = getDataDir();
const MITM_DIR = joinPath(DATA_DIR, "mitm");

module.exports = { DATA_DIR, MITM_DIR };

