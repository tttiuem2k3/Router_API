import os from "os";
import path from "path";

const getEnv = (name) => Reflect.get(process.env, name);
const getOsHomedir = () => Reflect.get(os, "homedir").call(os);
const joinPath = (...parts) => Reflect.get(path, "join").call(path, ...parts);

export const getHomeDir = () => {
  const homeDrive = getEnv("HOMEDRIVE");
  const homePath = getEnv("HOMEPATH");
  return (
    getEnv("USERPROFILE") ||
    (homeDrive && homePath ? `${homeDrive}${homePath}` : "") ||
    getEnv("HOME") ||
    getOsHomedir()
  );
};

export const getRoamingAppDataDir = () => {
  return getEnv("APPDATA") || joinPath(getHomeDir(), "AppData", "Roaming");
};

export const getLocalAppDataDir = () => {
  return getEnv("LOCALAPPDATA") || joinPath(getHomeDir(), "AppData", "Local");
};

export const joinRuntimePath = (...parts) => joinPath(...parts);
export const joinHomePath = (...parts) => joinPath(getHomeDir(), ...parts);
export const getWindowsNpmBinDir = () => joinPath(getRoamingAppDataDir(), "npm");
