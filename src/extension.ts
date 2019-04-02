import * as vscode from "vscode";
import * as nls from "vscode-nls";

import { Terminal, isTerminal } from "./model/terminal";
import { DefaultTerminal } from "./defaults/defaultTerminal";
import { DefaultContext } from "./defaults/defaultContext";
import { Alignment } from "./model/configuration";

const me = new DefaultContext(); // Empty context.

export function activate(context: vscode.ExtensionContext) {
  console.log("Extension is being activated.");

  context.subscriptions.push(
    vscode.commands.registerCommand("whichTerminal.setDefault", setDefault),
    vscode.commands.registerCommand("whichTerminal.openTerminal", openTerminal)
  );

  const config = me.getConfiguration();

  if (config.showDefaultOnStatusBar) {
    me.defaultTerminalButton = createDefaultTerminalStatusBarItem(
      config.statusBarItemAlignment
    );
  }
}

function createDefaultTerminalStatusBarItem(
  alignment: Alignment
): vscode.StatusBarItem {
  const result = vscode.window.createStatusBarItem(
    alignment === "left"
      ? vscode.StatusBarAlignment.Left
      : vscode.StatusBarAlignment.Right
  );

  result.command = "whichTerminal.setDefault";
  result.text = "$(terminal) Default Terminal: ?";
  result.show();

  return result;
}

export function deactivate() {}

async function setDefault(): Promise<void> {
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
