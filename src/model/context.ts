import { Configuration } from "./configuration";
import * as vscode from "vscode";

export interface Context {
  platform: Platform;
  defaultTerminalButton?: vscode.StatusBarItem;

  getConfiguration(): Configuration;
}

export enum Platform {
  Linux,
  Windows,
  Osx
}
