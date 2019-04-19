import { Configuration } from "./configuration";
import { TerminalArray } from "./terminalArray";
import { Platform } from "./platform";
import * as vscode from "vscode";

export interface Context {
  /**
   * Current running platform.
   *
   * @type {Platform}
   * @memberof Context
   */
  platform: Platform;

  /**
   * Returns current configuration.
   *
   * @returns {Configuration} Current configuration.
   * @memberof Context
   */
  getConfiguration(): Configuration;

  /**
   * Returns an array of shell templates available in the running platform.
   *
   * @returns {TerminalArray} A `TerminalArray` containing available shell
   *   templates.
   * @memberof Context
   */
  getTerminals(): TerminalArray;
}
