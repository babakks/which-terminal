import * as vscode from "vscode";
import { TerminalTreeItemViewModel } from "../viewModel/terminalTreeItemViewModel";

export class TerminalTreeItem extends vscode.TreeItem {
  constructor(private vm: TerminalTreeItemViewModel) {
    super(vm.terminal.name);
    this.id = TerminalTreeItem.getNewId();
    this.iconPath = {
      light: `${__dirname}/../../resources/light/terminal.svg`,
      dark: `${__dirname}/../../resources/dark/terminal.svg`
    };
  }

  private static getNewId(): string {
    return Math.floor(1e9 * Math.random()).toString();
  }
}
