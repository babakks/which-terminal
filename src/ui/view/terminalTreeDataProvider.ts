import * as vscode from "vscode";
import { TerminalTreeItem } from "./terminalTreeItem";
import { TerminalTreeItemViewModel } from "../viewModel/terminalTreeItemViewModel";
import { TerminalTreeViewModel } from "../viewModel/terminalTreeViewModel";

export class TerminalTreeDataProvider
  implements vscode.TreeDataProvider<TerminalTreeItemViewModel> {
  private map: Map<TerminalTreeItemViewModel, TerminalTreeItem> = new Map();
  private eventEmitter = new vscode.EventEmitter<TerminalTreeItemViewModel>();

  onDidChangeTreeData = this.eventEmitter.event;

  constructor(private vm: TerminalTreeViewModel) {
    this.populate(vm.items);
    this.vm.onDidAddItem(this.onDidAddItemHandler, this);
    this.vm.onDidDeleteItem(this.onDidDeleteItemHandler, this);
    this.vm.onDidChangeItems(this.onDidChangeItemsHandler, this);
  }

  getTreeItem(
    element: TerminalTreeItemViewModel
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    const result = this.map.get(element);
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
    return element ? undefined : this.vm.items;
  }

  private populate(items: TerminalTreeItemViewModel[]) {
    items.forEach(x => this.addItem(x));
  }

  private addItem(vm: TerminalTreeItemViewModel) {
    const result = new TerminalTreeItem(vm);
    this.map.set(vm, result);
  }

  private deleteItem(vm: TerminalTreeItemViewModel) {
    this.map.delete(vm);
  }

  private onDidAddItemHandler(e: TerminalTreeItemViewModel) {
    if (this.map.has(e)) {
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
    this.eventEmitter.fire(item);
  }
}
