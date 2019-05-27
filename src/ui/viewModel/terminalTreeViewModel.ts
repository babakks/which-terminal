import { TerminalTreeItemViewModel } from "./terminalTreeItemViewModel";
import * as vscode from "vscode";
import { ISimpleEvent, SimpleEventDispatcher } from "ste-simple-events";
import { EventEmitter } from "events";

export class TerminalTreeViewModel {
  private _map: Map<vscode.Terminal, TerminalTreeItemViewModel> = new Map();
  private _dispatcher = new SimpleEventDispatcher<
    TerminalTreeItemViewModel | undefined
  >();

  get items(): TerminalTreeItemViewModel[] {
    return Array.from(this._map.values());
  }

  get onDidChangeItems(): ISimpleEvent<TerminalTreeItemViewModel | undefined> {
    return this._dispatcher.asEvent();
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

  private deleteItem(
    key: vscode.Terminal
  ): TerminalTreeItemViewModel | undefined {
    const result = this._map.get(key);
    this._map.delete(key);
    return result;
  }
  //#endregion

  //#region Event listeners
  private onDidOpenTerminalHandler(e: vscode.Terminal) {
    this.notifyChange(this.addItem(e));
  }

  private onDidCloseTerminalHandler(e: vscode.Terminal) {
    this.notifyChange(this.deleteItem(e));
  }

  private onDidChangeActiveTerminalHandler(e: vscode.Terminal | undefined) {
    if (!e) {
      return;
    }
    this.notifyChange(this.getItem(e));
  }
  //#endregion

  private notifyChange(item: TerminalTreeItemViewModel | undefined) {
    this._dispatcher.dispatch(item);
  }
}
