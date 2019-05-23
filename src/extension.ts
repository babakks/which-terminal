import * as vscode from "vscode";
import { DefaultContext } from "./default/defaultContext";
import { getPlatform } from "./model/platform";
import { DefaultState } from "./default/state/defaultState";
import { Context } from "./model/context";
import { State } from "./model/state";
import { TerminalTreeDataProvider } from "./ui/terminalTreeDataProvider";

export function activate(context: vscode.ExtensionContext) {
  const platform = getPlatform();
  const state: State = new DefaultState(platform, context);
  const me: Context = new DefaultContext(platform, context, state);

  const dp = new TerminalTreeDataProvider();
  vscode.window.registerTreeDataProvider("terminalExplorerView", dp);

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
      "whichTerminal.kill",
      me.killCurrentTerminal,
      me
    )
  );
}

export function deactivate() {}
