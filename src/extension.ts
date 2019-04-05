import * as vscode from "vscode";
import * as nls from "vscode-nls";

import { Terminal } from "./model/terminal";
import { DefaultContext } from "./defaults/defaultContext";
import { Platform, Context } from "./model/context";
import { TerminalArray } from "./model/terminalArray";

let me: Context;
const localize = nls.config()();

export function activate(context: vscode.ExtensionContext) {
  console.log("Extension is being activated.");

  me = new DefaultContext(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("whichTerminal.setDefault", setDefault),
    vscode.commands.registerCommand("whichTerminal.openTerminal", openTerminal)
  );
}

export function deactivate() {}

async function setDefault(): Promise<void> {
  const terminal = await quickPickTerminal(true);

  throw new Error("Not implemented.");
}

async function openTerminal(): Promise<void> {
  const terminal = await quickPickTerminal(false);
  if (!terminal) {
    return;
  }

  createTerminal(terminal);
}

async function quickPickTerminal(
  selectDefault: boolean = false
): Promise<Terminal | undefined> {
  const terminals = getPlatformTerminals();
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

function getPlatformTerminals(): TerminalArray {
  const config = me.getConfiguration();

  return me.platform === Platform.Windows
    ? config.windowsTerminals
    : me.platform === Platform.Osx
    ? config.osxTerminals
    : config.linuxTerminals;
}

function createTerminal(
  terminal: Terminal,
  show: boolean = true
): vscode.Terminal {
  const options: vscode.TerminalOptions = {
    env: terminal.env,
    name: terminal.title,
    shellPath: terminal.shell,
    shellArgs: terminal.shellArgs,
    cwd: terminal.cwd
  };

  const result = vscode.window.createTerminal(options);

  if (terminal.init) {
    result.sendText(terminal.init.join("\r\n"));
  }

  if (show) {
    result.show();
  }

  return result;
}
