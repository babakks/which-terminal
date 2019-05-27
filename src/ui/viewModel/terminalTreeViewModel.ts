import { TerminalTreeItemViewModel } from "./terminalTreeItemViewModel";
import * as vscode from "vscode";
import { ISimpleEvent, SimpleEventDispatcher } from "ste-simple-events";
import { EventEmitter } from "events";

export class TerminalTreeViewModel {
  private _map: Map<vscode.Terminal, TerminalTreeItemViewModel> = new Map();

  private _onDidChangeItemsDispatcher = new SimpleEventDispatcher<
    TerminalTreeItemViewModel | undefined
  >();
  private _onDidAddItemDispatcher = new SimpleEventDispatcher<
    TerminalTreeItemViewModel
  >();
  private _onDidDeleteItemDispatcher = new SimpleEventDispatcher<
    TerminalTreeItemViewModel
  >();

  get items(): TerminalTreeItemViewModel[] {
    return Array.from(this._map.values());
  }

  get onDidChangeItems(): ISimpleEvent<TerminalTreeItemViewModel | undefined> {
    return this._onDidChangeItemsDispatcher.asEvent();
  }

  get onDidAddItem(): ISimpleEvent<TerminalTreeItemViewModel> {
    return this._onDidAddItemDispatcher.asEvent();
  }

  get onDidDeleteItem(): ISimpleEvent<TerminalTreeItemViewModel> {
    return this._onDidDeleteItemDispatcher.asEvent();
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
    return this._map.get(key);
  }

  private addItem(key: vscode.Terminal): TerminalTreeItemViewModel {
    const result = new TerminalTreeItemViewModel(key);
    this._map.set(key, result);
    return result;
  }

  private deleteItem(key: vscode.Terminal): TerminalTreeItemViewModel {
    const result = this._map.get(key);
    if (!result) {
      throw new Error("ViewModel for the given key is missing.");
    }

    this._map.delete(key);
    return result;
  }
  //#endregion

  //#region Event listeners
  private onDidOpenTerminalHandler(e: vscode.Terminal) {
    this._onDidAddItemDispatcher.dispatch(this.addItem(e));
  }

  private onDidCloseTerminalHandler(e: vscode.Terminal) {
    this._onDidDeleteItemDispatcher.dispatch(this.deleteItem(e));
  }

  private onDidChangeActiveTerminalHandler(e: vscode.Terminal | undefined) {
    if (!e) {
      return;
    }
    this._onDidChangeItemsDispatcher.dispatch(this.getItem(e));
  }
  //#endregion
}
