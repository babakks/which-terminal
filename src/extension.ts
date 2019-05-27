import * as vscode from "vscode";
import { DefaultContext } from "./default/defaultContext";
import { getPlatform } from "./model/platform";
import { DefaultState } from "./default/state/defaultState";
import { Context } from "./model/context";
import { State } from "./model/state";
import { TerminalTreeDataProvider } from "./ui/view/terminalTreeDataProvider";
import { TerminalTreeViewModel } from "./ui/viewModel/terminalTreeViewModel";
import { TerminalTreeItemViewModel } from "./ui/viewModel/terminalTreeItemViewModel";

export function activate(context: vscode.ExtensionContext) {
  const platform = getPlatform();
  const state: State = new DefaultState(platform, context);
  const me: Context = new DefaultContext(platform, context, state);

  const treeViewModel = new TerminalTreeViewModel();
  const options: vscode.TreeViewOptions<TerminalTreeItemViewModel> = {
    treeDataProvider: new TerminalTreeDataProvider(treeViewModel)
  };
  const tree = vscode.window.createTreeView("terminalExplorerView", options);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "whichTerminal.setDefault",
      me.askAndSetDefaultTerminal,
      me
    ),
    vscode.commands.registerCommand(
      "whichTerminal.setWorkspaceDefault",
      me.askAndSetWorkspaceDefault,
      me
    ),
    vscode.commands.registerCommand(
      "whichTerminal.open",
      me.askAndOpenTerminal,
      me
    ),
    vscode.commands.registerCommand(
      "whichTerminal.openAs",
      me.askAndOpenEntitledTerminal,
      me
    ),
    vscode.commands.registerCommand(
      "whichTerminal.switch",
      me.askAndSwitchTerminal,
      me
    ),
    vscode.commands.registerCommand(
      "whichTerminal.switchNext",
      me.switchNextTerminal,
      me
    ),
    vscode.commands.registerCommand(
      "whichTerminal.killAll",
      me.killAllTerminals,
      me
    ),
    vscode.commands.registerCommand(
      "whichTerminal.killActive",
      me.killActiveTerminal,
      me
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "whichTerminal.killTreeItemTerminal",
      (item: TerminalTreeItemViewModel) => {
        item.terminal.dispose();
      }
    )
  );
}

export function deactivate() {}
