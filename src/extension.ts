import { DefaultContext } from "./default/defaultContext";

import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const me = new DefaultContext(context);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "whichTerminal.setDefault",
      me.askAndSetDefault
    ),
    vscode.commands.registerCommand(
      "whichTerminal.openTerminal",
      me.askAndOpenTerminal
    )
  );
}

export function deactivate() {}
