import { Configuration } from "./configuration";
import { TerminalArray } from "./terminalArray";
import { Platform } from "./platform";
import * as vscode from "vscode";
import { Terminal } from "./terminal";

/**
 * Encapsulates extension behaviors and data.
 *
 * @export
 * @interface Context
 */
export interface Context {
  /**
   * Current running platform.
   *
   * @type {Platform}
   * @memberof Context
   */
  platform: Platform;

  /**
   * Asks for a shell template to sets as default integrated shell.
   *
   * @returns {Promise<void>}
   * @memberof Context
   */
  askAndSetDefault(): Promise<void>;

  /**
   * Asks for a shell template to open as a new integrated shell.
   *
   * @returns {Promise<void>}
   * @memberof Context
   */
  askAndOpenTerminal(): Promise<void>;
}
