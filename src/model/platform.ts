export enum Platform {
  Linux,
  Windows,
  Osx
}

/**
 * Returns the enumerated platform value (`Platform`) given `node.js` process
 * platform (i.e., `process.platform`).
 *
 * @export
 * @param {string} [platform=process.platform] Platform string representation (i.e.,
 *   `process.platform`)
 * @returns {Platform}
 */
export function getPlatform(platform: string = process.platform): Platform {
  return platform === "win32"
    ? Platform.Windows
    : platform === "darwin"
    ? Platform.Osx
    : Platform.Linux;
}
