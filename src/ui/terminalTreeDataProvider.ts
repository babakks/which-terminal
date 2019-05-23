import * as vscode from "vscode";
import { TerminalTreeItem } from "./terminalTreeItem";
import { Terminal } from "../model/terminal";
import { Context } from "../model/context";
import { VisualTerminal } from "../model/visualTerminal";
import { OpenTerminalEventArgs } from "../model/eventArgs/openTerminalEventArgs";

export class TerminalTreeDataProvider
  implements vscode.TreeDataProvider<VisualTerminal> {
  private items: Map<VisualTerminal, TerminalTreeItem> = new Map();
  private eventEmitter = new vscode.EventEmitter<VisualTerminal>();

  onDidChangeTreeData: vscode.Event<VisualTerminal>;

  constructor(private context: Context) {
    this.onDidChangeTreeData = this.eventEmitter.event;
    vscode.window.onDidOpenTerminal()
    this.context.onDidOpenTerminal.subscribe(this.onDidOpenTerminalHandler);
  }

  getTreeItem(
    element: VisualTerminal
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return this.items.get(element)!;
  }

  getChildren(
    element?: VisualTerminal
  ): vscode.ProviderResult<VisualTerminal[]> {
    return undefined;
  }

  private createTreeItem(visualTerminal: VisualTerminal): TerminalTreeItem {
    return new TerminalTreeItem(visualTerminal);
  }

  private onDidOpenTerminalHandler(e: vscode.Terminal) {    
    this.items.set(e.visualTerminal, this.createTreeItem(e.visualTerminal));
    this.notifyChange(e.visualTerminal);
  }

  private notifyChange(item: VisualTerminal) {
    this.eventEmitter.fire(item);
  }
}
