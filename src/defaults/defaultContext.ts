import { Context, Platform } from "../model/context";
import * as vscode from "vscode";
import { Configuration } from "../model/configuration";
import { DefaultConfiguration } from "./defaultConfiguration";

export class DefaultContext implements Context {
  platform: Platform;

  constructor() {
    this.platform =
      process.platform === "win32"
        ? Platform.Windows
        : process.platform === "darwin"
        ? Platform.Osx
        : Platform.Linux;
  }

  getConfiguration(): Configuration {
    return DefaultConfiguration.from(
      vscode.workspace.getConfiguration("whichTerminal")
    );
  }
}
