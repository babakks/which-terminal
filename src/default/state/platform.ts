/**
 * Defines possible platforms.
 *
 * @export
 * @enum {number}
 */
export enum Platform {
  Windows,
  Osx,
  Linux
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

/**
 * Returns one of the arguments that corresponds with the given platform.
 *
 * @export
 * @template T Type of the arguments.
 * @param {Platform} platform
 * @param {T} windows Argument to return on Windows platform.
 * @param {T} osx Argument to return on Osx platform.
 * @param {T} linux Argument to return on Linux platform.
 * @returns One of the arguments that corresponds to the `platform`.
 */
export function onPlatform<T>(
  platform: Platform,
  windows: T,
  osx: T,
  linux: T
): T {
  return platform === Platform.Windows
    ? windows
    : platform === Platform.Osx
    ? osx
    : linux;
}
