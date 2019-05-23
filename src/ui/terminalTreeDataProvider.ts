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
    vscode.window.onDidOpenTerminal(this.onDidOpenTerminalHandler, this);
    vscode.window.onDidCloseTerminal(this.onDidCloseTerminalHandler, this);
    vscode.window.onDidChangeActiveTerminal(
      this.onDidChangeActiveTerminalHandler,
      this
    );

    this.populate();
  }

  getTreeItem(
    element: vscode.Terminal
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return this.items.get(element)!;
  }

  getChildren(
    element?: vscode.Terminal
  ): vscode.ProviderResult<vscode.Terminal[]> {
    return element ? undefined : Array.from(this.items.keys());
  }

  private populate() {
    if (!vscode.window.terminals.length) {
      return;
    }

    vscode.window.terminals.forEach(x => this.addTreeItem(x));
  }

  private addTreeItem(terminal: vscode.Terminal) {
    this.items.set(terminal, new TerminalTreeItem(terminal));
    return new TerminalTreeItem(terminal);
  }

  private onDidOpenTerminalHandler(e: vscode.Terminal) {
    this.addTreeItem(e);
    this.notifyChange(e);
  }

  private onDidCloseTerminalHandler(e: vscode.Terminal) {
    this.items.delete(e);
    this.notifyChange(e);
  }

  private onDidChangeActiveTerminalHandler(e: vscode.Terminal | undefined) {
    if (!e) {
      return;
    }
    this.notifyChange(e);
  }

  private notifyChange(item: vscode.Terminal) {
    this.eventEmitter.fire();
  }
}
