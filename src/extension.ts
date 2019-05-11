import { DefaultContext } from "./default/defaultContext";
import * as vscode from "vscode";
import { getPlatform } from "./model/platform";
import { DefaultState } from "./default/state/defaultState";

export function activate(context: vscode.ExtensionContext) {
  const platform = getPlatform();
  const state = new DefaultState(platform, context);
  const me = new DefaultContext(platform, context, state);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "whichTerminal.setDefault",
      me.askAndSetDefault,
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
      "whichTerminal.switch",
      me.switchTerminal,
      me
    ),
    vscode.commands.registerCommand(
      "whichTerminal.switchNext",
      me.switchNextTerminal,
      me
    )
  );
}

export function deactivate() {}
