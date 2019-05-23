import * as vscode from "vscode";
import { VisualTerminal } from "../model/visualTerminal";

export class TerminalTreeItem extends vscode.TreeItem {
  constructor(visualTerminal: VisualTerminal) {
    super(visualTerminal.vsCodeTerminal.name);
  }
}
