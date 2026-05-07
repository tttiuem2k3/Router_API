import { getRoamingAppDataDir, joinHomePath, joinRuntimePath } from "./runtimePaths";

const APP_NAME = "ttt_router";

export function getDataDir() {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  if (process.platform === "win32") {
    return joinRuntimePath(getRoamingAppDataDir(), APP_NAME);
  }
  return joinHomePath(`.${APP_NAME}`);
}

export const DATA_DIR = getDataDir();

