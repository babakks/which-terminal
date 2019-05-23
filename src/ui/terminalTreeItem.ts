import * as vscode from "vscode";

export class TerminalTreeItem extends vscode.TreeItem {
  constructor(terminal: vscode.Terminal) {
    super(terminal.name);
  }
}
