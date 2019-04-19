import * as vscode from "vscode";
import * as nls from "vscode-nls";

import { Terminal } from "./model/terminal";
import { DefaultContext } from "./default/defaultContext";
import { Platform, Context } from "./model/context";
import { TerminalArray } from "./model/terminalArray";

/**
 * Extension running context.
 *
 * @type {Context}
 */
let me: Context;

const localize = nls.config()();

export function activate(context: vscode.ExtensionContext) {
  me = new DefaultContext(context);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "whichTerminal.setDefault",
      askAndSetDefault
    ),
    vscode.commands.registerCommand(
      "whichTerminal.openTerminal",
      askAndOpenTerminal
    )
  );
}

export function deactivate() {}

/**
 * Asks for a shell template to sets as default integrated shell.
 *
 * @returns {Promise<void>}
 */
async function askAndSetDefault(): Promise<void> {
  const terminal = await quickPickTerminal(true);

  throw new Error("Not implemented.");
}

/**
 * Asks for a shell template to open as a new integrated shell.
 *
 * @returns {Promise<void>}
 */
async function askAndOpenTerminal(): Promise<void> {
  const terminal = await quickPickTerminal(false);
  if (!terminal) {
    return;
  }

  createTerminal(terminal);
}

/**
 * Brings up a quick-pick list of available shell templates.
 *
 * @param {boolean} [selectDefault=false] Indicates whether the list is going to
 *   be populated to set the default shell template.
 * @returns {(Promise<Terminal | undefined>)} Returns a `Promise` that resolves
 *   with the selected `Terminal`, if any; otherwise, resolves with `undefined`.
 */
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

/**
 * Returns an array of shell templates available in the running platform.
 *
 * @returns {TerminalArray} A `TerminalArray` containing available shell
 *   templates.
 */
function getPlatformTerminals(): TerminalArray {
  const config = me.getConfiguration();

  return me.platform === Platform.Windows
    ? config.windowsTerminals
    : me.platform === Platform.Osx
    ? config.osxTerminals
    : config.linuxTerminals;
}

/**
 * Creates a new integrated terminal given the underlying shell template.
 *
 * @param {Terminal} terminal The `Terminal` object describing the template.
 * @param {boolean} [show=true] Indicates whether to show the terminal once
 *   it's created.
 * @returns {vscode.Terminal} The created `vscode.Terminal` instance.
 */
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
