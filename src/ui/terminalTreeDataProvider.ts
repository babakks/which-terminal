import * as vscode from "vscode";
import { TerminalTreeItem } from "./terminalTreeItem";
import { Terminal } from "../model/terminal";
import { Context } from "../model/context";
import { VisualTerminal } from "../model/visualTerminal";
import { OpenTerminalEventArgs } from "../model/eventArgs/openTerminalEventArgs";

export class TerminalTreeDataProvider
  implements vscode.TreeDataProvider<vscode.Terminal> {
  private items: Map<vscode.Terminal, TerminalTreeItem> = new Map();
  private eventEmitter = new vscode.EventEmitter<vscode.Terminal>();

  onDidChangeTreeData: vscode.Event<vscode.Terminal>;

  constructor(private context: Context) {
    this.onDidChangeTreeData = this.eventEmitter.event;
    vscode.window.onDidOpenTerminal(this.onDidOpenTerminalHandler);
  }

  getTreeItem(
    element: vscode.Terminal
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return this.items.get(element)!;
  }

  getChildren(
    element?: vscode.Terminal
  ): vscode.ProviderResult<vscode.Terminal[]> {
    return undefined;
  }

  private createTreeItem(terminal: vscode.Terminal): TerminalTreeItem {
    return new TerminalTreeItem(terminal);
  }

  private onDidOpenTerminalHandler(e: vscode.Terminal) {
    this.items.set(e, this.createTreeItem(e));
    this.notifyChange(e);
  }

  private notifyChange(item: vscode.Terminal) {
    this.eventEmitter.fire(item);
  }
}
