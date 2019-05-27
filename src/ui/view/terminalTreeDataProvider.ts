import * as vscode from "vscode";
import { TerminalTreeItem } from "./terminalTreeItem";
import { TerminalTreeItemViewModel } from "../viewModel/terminalTreeItemViewModel";
import { TerminalTreeViewModel } from "../viewModel/terminalTreeViewModel";

export class TerminalTreeDataProvider
  implements vscode.TreeDataProvider<TerminalTreeItemViewModel> {
  private _map: Map<TerminalTreeItemViewModel, TerminalTreeItem> = new Map();
  private _eventEmitter = new vscode.EventEmitter<TerminalTreeItemViewModel>();

  onDidChangeTreeData: vscode.Event<TerminalTreeItemViewModel>;

  constructor(private _vm: TerminalTreeViewModel) {
    this.onDidChangeTreeData = this._eventEmitter.event;

    this.populate(_vm.items);

    this._vm.onDidAddItem.subscribe(this.onDidAddItemHandler.bind(this));
    this._vm.onDidDeleteItem.subscribe(this.onDidDeleteItemHandler.bind(this));
    this._vm.onDidChangeItems.subscribe(
      this.onDidChangeItemsHandler.bind(this)
    );
  }

  getTreeItem(
    element: TerminalTreeItemViewModel
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    const result = this._map.get(element);
    if (!result) {
      throw new Error(
        "TreeViewItem associated to the given TreeViewItemViewModel not found."
      );
    }
    return result;
  }

  getChildren(
    element?: TerminalTreeItemViewModel
  ): vscode.ProviderResult<TerminalTreeItemViewModel[]> {
    return element ? undefined : this._vm.items;
  }

  private populate(items: TerminalTreeItemViewModel[]) {
    items.forEach(x => this.addItem(x));
  }

  private addItem(vm: TerminalTreeItemViewModel) {
    const result = new TerminalTreeItem(vm);
    this._map.set(vm, result);
  }

  private deleteItem(vm: TerminalTreeItemViewModel) {
    this._map.delete(vm);
  }

  private onDidAddItemHandler(e: TerminalTreeItemViewModel) {
    if (this._map.has(e)) {
      return;
    }
    this.addItem(e);    
    this.notifyChange();
  }

  private onDidDeleteItemHandler(e: TerminalTreeItemViewModel) {
    this.deleteItem(e);
    this.notifyChange();    
  }

  private onDidChangeItemsHandler(e: TerminalTreeItemViewModel | undefined) {
    this.notifyChange();
  }

  private notifyChange(item?: TerminalTreeItemViewModel) {
    this._eventEmitter.fire(item);
  }
}
