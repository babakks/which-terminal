import { Context } from "../model/context";
import { Configuration } from "../model/configuration";
import { DefaultConfiguration } from "./defaultConfiguration";
import { TerminalArray } from "../model/terminalArray";
import { Platform, getPlatform } from "../model/platform";
import * as vscode from "vscode";

export class DefaultContext implements Context {
  /**
   * Current running platform.
   *
   * @type {Platform}
   * @memberof DefaultContext
   */
  platform: Platform;

  /**
   * Creates an instance of `DefaultContext`.
   *
   * @param {vscode.ExtensionContext} vscodeContext VS Code original context
   *   object.
   * @memberof DefaultContext
   */
  constructor(private vscodeContext: vscode.ExtensionContext) {
    this.platform = getPlatform();
  }

  /**
   * Returns current configuration.
   *
   * @returns {Configuration} Current configuration.
   * @memberof DefaultContext
   */
  getConfiguration(): Configuration {
    return DefaultConfiguration.from(
      vscode.workspace.getConfiguration("whichTerminal")
    );
  }

  /**
   * Returns an array of shell templates available in the running platform.
   *
   * @returns {TerminalArray} A `TerminalArray` containing available shell
   *   templates.
   * @memberof DefaultContext
   */
  getTerminals(): TerminalArray {
    const config = this.getConfiguration();

    return this.platform === Platform.Windows
      ? config.windowsTerminals
      : this.platform === Platform.Osx
      ? config.osxTerminals
      : config.linuxTerminals;
  }
}
