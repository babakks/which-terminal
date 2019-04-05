import { Configuration } from "./configuration";
import * as vscode from "vscode";

export interface Context {
  platform: Platform;
  vscodeContext: vscode.ExtensionContext;

  getConfiguration(): Configuration;
}

export enum Platform {
  Linux,
  Windows,
  Osx
}
