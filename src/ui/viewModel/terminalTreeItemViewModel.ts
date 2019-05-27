import * as vscode from "vscode";

export class TerminalTreeItemViewModel {
  constructor(public terminal: vscode.Terminal) {}
}
