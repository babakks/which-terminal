import { TerminalTreeItemViewModel } from "./terminalTreeItemViewModel";
import * as vscode from "vscode";

declare type Emitter<T> = vscode.EventEmitter<T>;
declare type Event = Emitter<TerminalTreeItemViewModel>;
declare type EventU = Emitter<TerminalTreeItemViewModel | undefined>;

export class TerminalTreeViewModel {
  private map: Map<vscode.Terminal, TerminalTreeItemViewModel> = new Map();
  private onDidChangeItemsEmitter: EventU = new vscode.EventEmitter();
  private onDidAddItemEmitter: Event = new vscode.EventEmitter();
  private onDidDeleteItemEmitter: Event = new vscode.EventEmitter();

  onDidChangeItems = this.onDidChangeItemsEmitter.event;
  onDidAddItem = this.onDidAddItemEmitter.event;
  onDidDeleteItem = this.onDidDeleteItemEmitter.event;

  get items(): TerminalTreeItemViewModel[] {
    return Array.from(this.map.values());
  }

  constructor() {
    vscode.window.onDidOpenTerminal(this.onDidOpenTerminalHandler, this);
    vscode.window.onDidCloseTerminal(this.onDidCloseTerminalHandler, this);
    vscode.window.onDidChangeActiveTerminal(
      this.onDidChangeActiveTerminalHandler,
      this
    );

    this.populate(vscode.window.terminals);
  }

  //#region Map encapsulation methods.
  private populate(keys: readonly vscode.Terminal[]) {
    keys.forEach(x => this.addItem(x));
  }

  private getItem(key: vscode.Terminal): TerminalTreeItemViewModel | undefined {
    return this.map.get(key);
  }

  private addItem(key: vscode.Terminal): TerminalTreeItemViewModel {
    const result = new TerminalTreeItemViewModel(key);
    this.map.set(key, result);
    return result;
  }

  private deleteItem(key: vscode.Terminal): TerminalTreeItemViewModel {
    const result = this.map.get(key);
    if (!result) {
      throw new Error("ViewModel for the given key is missing.");
    }

    this.map.delete(key);
    return result;
  }
  //#endregion

  //#region Event listeners
  private onDidOpenTerminalHandler(e: vscode.Terminal) {
    this.onDidAddItemEmitter.fire(this.addItem(e));
  }

  private onDidCloseTerminalHandler(e: vscode.Terminal) {
    this.onDidDeleteItemEmitter.fire(this.deleteItem(e));
  }

  private onDidChangeActiveTerminalHandler(e: vscode.Terminal | undefined) {
    this.onDidChangeItemsEmitter.fire(e ? this.getItem(e) : undefined);
  }
  //#endregion
}
