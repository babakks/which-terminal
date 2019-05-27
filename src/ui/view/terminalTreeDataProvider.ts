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
    _vm.onDidChangeItems.subscribe(e => {
      this.notifyChange(e);
    });
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

  private notifyChange(item?: TerminalTreeItemViewModel) {
    this._eventEmitter.fire(item);
  }
}
