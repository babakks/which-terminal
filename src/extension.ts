import * as vscode from "vscode";
import * as nls from "vscode-nls";

import { Terminal, isTerminal } from "./model/terminal";
import { DefaultTerminal } from "./defaults/defaultTerminal";

let localize: nls.LocalizeFunc;

export function activate(context: vscode.ExtensionContext) {
  console.log("Extension is being activated.");

  localize = nls.config()();

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.changeDefaultTerminal",
      changeDefaultTerminalCommand
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.openTerminal", openTerminal)
  );

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );

  statusBarItem.command = "extension.changeDefaultTerminal";
  statusBarItem.text = "$(light-bulb) Default Terminal: ?";
  statusBarItem.show();
}

export function deactivate() {}

async function changeDefaultTerminalCommand(): Promise<void> {
  const terminal = await quickPickTerminal(true);
  vscode.window.showInformationMessage(
    terminal ? terminal.title || terminal.shell : "Canceled"
  );
}

async function openTerminal(): Promise<void> {
  const terminal = await quickPickTerminal(false);
  vscode.window.showInformationMessage(
    terminal ? terminal.title || terminal.shell : "Canceled"
  );
}

async function quickPickTerminal(
  selectDefault: boolean = false
): Promise<Terminal | undefined> {
  const terminals = getOSTerminals();
  if (!terminals) {
    return undefined;
  }

  const options: vscode.QuickPickOptions = {
    placeHolder: selectDefault
      ? localize(
          "quickPickSelectDefaultTerminalPlaceHolder",
          "Select default terminal"
        )
      : localize("quickPickSelectTerminalPlaceHolder", "Select terminal")
  };

  const titles = terminals.map(x => x.title || x.shell);
  const selection = await vscode.window.showQuickPick(titles, options);

  return !selection
    ? undefined
    : terminals.find(x => (x.title ? x.title === selection : !!x.shell));
}

function getOSTerminals(): Terminal[] | undefined {
  const config = vscode.workspace.getConfiguration("which-terminal");
  const terminals = config.windowsTerminals; // Just windows, for now.

  return !Array.isArray(terminals)
    ? undefined
    : terminals.filter(x => isTerminal(x)).map(x => DefaultTerminal.from(x));
}
