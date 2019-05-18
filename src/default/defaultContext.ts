import { Context } from "../model/context";
import { Configuration } from "../model/configuration";
import { DefaultConfiguration } from "./defaultConfiguration";
import { TerminalArray } from "../model/terminalArray";
import { DefaultTerminalArray } from "./DefaultTerminalArray";
import { Terminal } from "../model/terminal";
import { Platform, onPlatform } from "../model/platform";
import { State } from "../model/state";

import * as vscode from "vscode";
import * as nls from "vscode-nls";

const localize = nls.config()();

/**
 * Default extension `Context` implementation.
 *
 * @export
 * @interface Context
 */
export class DefaultContext implements Context {
  /**
   * Map of terminals opened by the extension.
   *
   * @private
   * @memberof DefaultContext
   */
  private openedTerminals = new Map<vscode.Terminal, Terminal>();

  /**
   * Creates an instance of `DefaultContext`.
   *
   * @param {vscode.ExtensionContext} vscodeContext VS Code original context
   *   object.
   * @memberof DefaultContext
   */
  constructor(
    private platform: Platform,
    private vscodeContext: vscode.ExtensionContext,
    public state: State
  ) {
    vscode.window.onDidCloseTerminal((e: vscode.Terminal) => {
      this.openedTerminals.delete(e);
    });
  }

  /**
   * Asks for a shell template to sets as default integrated shell.
   *
   * @returns {Promise<void>}
   * @memberof DefaultContext
   */
  async askAndSetDefaultTerminal(): Promise<void> {
    const terminal = await this.quickPickTerminal(true);
    if (!terminal) {
      return;
    }

    this.setDefaultTerminal(terminal);
  }

  /**
   * Asks for a shell template to sets as default *workspace* integrated shell.
   *
   * @returns {Promise<void>}
   * @memberof DefaultContext
   */
  async askAndSetWorkspaceDefault(): Promise<void> {
    const terminal = await this.quickPickTerminal(true);
    if (!terminal) {
      return;
    }

    this.setDefaultTerminal(terminal, true);
  }

  /**
   * Asks for a shell template to open as a new integrated shell.
   *
   * @returns {Promise<void>}
   * @memberof DefaultContext
   */
  async askAndOpenTerminal(): Promise<void> {
    const terminal = await this.quickPickTerminal(false);
    if (!terminal) {
      return;
    }

    this.createTerminal(terminal);
    this.updateRecentTerminalsListOrder(terminal);
  }

  /**
   * Lists open terminals and switches to the selected terminal.
   *
   * @returns {Promise<void>}
   * @memberof DefaultContext
   */
  async askAndSwitchTerminal(): Promise<void> {
    if (!this.notifyIfNoOpenTerminal()) {
      return;
    }

    const terminal = await this.quickPickOpenTerminals();

    if (!terminal) {
      return;
    }

    terminal.show();
  }

  /**
   * Switches to the next open terminal.
   *
   * @memberof Context
   */
  async switchNextTerminal(): Promise<void> {
    if (!this.notifyIfNoOpenTerminal()) {
      return;
    }

    this.focusNextTerminal();
  }

  /**
   * Closes all open terminals.
   *
   * @returns {Promise<void>}
   * @memberof Context
   */
  async closeAllTerminals(): Promise<void> {
    vscode.window.terminals.forEach(x => x.dispose());
  }

  /**
   * Focuses on the next open terminal, if any.
   *
   * @private
   * @memberof DefaultContext
   */
  private focusNextTerminal(): void {
    const activeTerminal = vscode.window.activeTerminal;
    const newTerminalIndex = !activeTerminal
      ? 0
      : (1 + vscode.window.terminals.indexOf(activeTerminal)) %
        vscode.window.terminals.length;
    const newTerminal = vscode.window.terminals[newTerminalIndex];

    newTerminal.show(true);
  }

  /**
   * Checks if there is any open terminal, and displays an error message if
   * there was none.
   *
   * @private
   * @returns {boolean} A Promise that resolves to `false` if no open terminal
   *   was found; otherwise, resolves to `true`.
   * @memberof DefaultContext
   */
  private async notifyIfNoOpenTerminal(): Promise<boolean> {
    if (vscode.window.terminals.length) {
      return true;
    }

    await vscode.window.showErrorMessage(
      localize("noOpenTerminalPresent", "There's no open terminal.")
    );

    return false;
  }

  /**
   * Returns current configuration.
   *
   * @private
   * @returns {Configuration} Current configuration.
   * @memberof DefaultContext
   */
  private getConfiguration(): Configuration {
    return DefaultConfiguration.from(
      vscode.workspace.getConfiguration("whichTerminal")
    );
  }

  /**
   * Returns an array of shell templates available in the running platform.
   *
   * @private
   * @param {boolean} [ordered=true] Indicates whether frequently used templates
   *   should occur first in the returned `TerminalArray`.
   * @returns {TerminalArray} A `TerminalArray` containing available shell
   *   templates.
   * @memberof DefaultContext
   */
  private getTerminals(ordered: boolean = true): TerminalArray {
    const config = this.getConfiguration();

    const terminals = onPlatform(
      this.platform,
      config.windowsTerminals,
      config.osxTerminals,
      config.linuxTerminals
    );

    return ordered ? this.reorderTerminals(terminals) : terminals;
  }

  /**
   * Brings up a quick-pick list of available shell templates.
   *
   * @private
   * @param {boolean} [selectDefault=false] Indicates whether the list is going
   *   to be populated to set the default shell template.
   * @returns {Promise<Terminal | undefined>} Returns a `Promise` that resolves
   *   with the selected `Terminal`, if any; otherwise, resolves with
   *   `undefined`.
   * @memberof DefaultContext
   */
  private async quickPickTerminal(
    selectDefault: boolean = false
  ): Promise<Terminal | undefined> {
    const terminals = this.getTerminals();
    if (!terminals) {
      return undefined;
    }

    const options: vscode.QuickPickOptions = {
      matchOnDescription: true,
      placeHolder: selectDefault
        ? localize(
            "quickPickSelectDefaultTerminalPlaceHolder",
            "Select a terminal to set as default"
          )
        : localize(
            "quickPickSelectTerminalPlaceHolder",
            "Select a terminal to open"
          )
    };

    const prefix = "$(terminal)";
    const makeLabel = (t: Terminal) => `${prefix} ${t.title || t.shell}`;
    const makeDescription = (t: Terminal) => (t.title ? t.shell : "");
    const makeQuickPickItem = (t: Terminal): vscode.QuickPickItem => ({
      label: makeLabel(t),
      description: makeDescription(t)
    });

    const makeEntry = (t: Terminal): [vscode.QuickPickItem, Terminal] => [
      makeQuickPickItem(t),
      t
    ];
    const map = new Map(terminals.map(makeEntry));
    const titles = Array.from(map.keys());

    const selection = await vscode.window.showQuickPick(titles, options);
    return selection ? map.get(selection) : undefined;
  }

  /**
   * Brings up a quick-pick list of current open terminals.
   *
   * @private
   * @returns {Promise<vscode.Terminal | undefined>} A Promise that resolves
   *  with the selected `vscode.Terminal`, if any; otherwise, resolve with
   *  `undefined`. If there was no open terminal, the method returns
   *  `undefined`.
   * @memberof DefaultContext
   */
  private async quickPickOpenTerminals(): Promise<vscode.Terminal | undefined> {
    if (!vscode.window.terminals.length) {
      return undefined;
    }

    const options: vscode.QuickPickOptions = {
      matchOnDescription: true,
      placeHolder: localize(
        "quickPickSwitchOpenTerminalsPlaceHolder",
        "Select a terminal to switch"
      )
    };

    const prefix = "$(terminal)";
    const makeLabel = (t: vscode.Terminal, i: number) =>
      `${prefix} ${1 + i}: ${t.name}`;
    const makeDescription = (t: vscode.Terminal, _i: number) =>
      this.openedTerminals.has(t) ? "$(star)" : "";
    const makeQuickPickItem = (
      t: vscode.Terminal,
      i: number
    ): vscode.QuickPickItem => ({
      label: makeLabel(t, i),
      description: makeDescription(t, i)
    });

    const makeEntry = (
      t: vscode.Terminal,
      i: number
    ): [vscode.QuickPickItem, vscode.Terminal] => [makeQuickPickItem(t, i), t];
    const map = new Map(vscode.window.terminals.map(makeEntry));
    const titles = Array.from(map.keys());

    const selection = await vscode.window.showQuickPick(titles, options);
    return selection ? map.get(selection) : undefined;
  }

  /**
   * Creates a new integrated terminal given the underlying shell template.
   *
   * @private
   * @param {Terminal} terminal The `Terminal` object describing the template.
   * @param {boolean} [show=true] Indicates whether to show the terminal once
   *   it's created.
   * @returns {vscode.Terminal} The created `vscode.Terminal` instance.
   * @memberof DefaultContext
   */
  private createTerminal(
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

    this.updateRecentTerminalsListOrder(terminal);
    this.openedTerminals.set(result, terminal);

    return result;
  }

  /**
   * Sets the default terminal to the given template.
   *
   * @param {Terminal} terminal New default terminal.
   * @param {boolean} [globalScope=false] Set to `true` to set the *global*
   *   default terminal.
   * @memberof DefaultContext
   */
  private async setDefaultTerminal(
    terminal: Terminal,
    globalScope: boolean = false
  ): Promise<void> {
    const scope = globalScope;
    const key = onPlatform(this.platform, "windows", "osx", "linux");

    const shell = "terminal.integrated.shell";
    const args = "terminal.integrated.shellArgs";
    const envs = "terminal.integrated.envs";
    const cwd = "terminal.integrated";

    await this.updateConfigValue(shell, key, terminal.shell, scope);
    await this.updateConfigValue(args, key, terminal.shellArgs || [], scope);
    await this.updateConfigValue(envs, key, terminal.env || {}, scope);
    await this.updateConfigValue(cwd, "cwd", terminal.cwd || "", scope);
  }

  private async updateConfigValue<T>(
    section: string,
    key: string,
    value: T,
    globalScope: boolean = false
  ) {
    const config = vscode.workspace.getConfiguration(section);
    if (!config) {
      return;
    }

    await config.update(key, value, globalScope);
  }

  /**
   * Reorders given array of terminals so that recently-used items appear on the
   * top.
   *
   * @private
   * @param {TerminalArray} terminals Array of terminals to reorder.
   * @returns {TerminalArray} An ordered `TerminalArray`.
   * @memberof DefaultContext
   */
  private reorderTerminals(terminals: TerminalArray): TerminalArray {
    const recentListSize = this.getConfiguration().recentTerminalsListSize;
    if (!recentListSize) {
      return terminals;
    }

    const order = this.state.order.filter((x, i) => i < recentListSize);
    if (!order.length) {
      return terminals;
    }

    const recentItems = terminals.filter(x => -1 !== order.indexOf(x.id));
    const otherItems = terminals.filter(x => -1 === recentItems.indexOf(x));

    const sortedRecentItems = recentItems.sort(
      (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
    );

    return new DefaultTerminalArray(...sortedRecentItems, ...otherItems);
  }

  /**
   * Moves the given template to the top of the recently-used terminals.
   *
   * @private
   * @param {Terminal} terminal
   * @memberof DefaultContext
   */
  private updateRecentTerminalsListOrder(terminal: Terminal): void {
    const recentListSize = this.getConfiguration().recentTerminalsListSize;
    if (!recentListSize) {
      return;
    }

    // Moving/adding the terminal's ID to the top of the list.
    this.state.order = [
      terminal.id,
      ...this.state.order.filter(x => x !== terminal.id) // Removing the terminal's ID from the rest of the list.
    ].filter((_x, i) => i < recentListSize); // Truncating the list to `recentListSize` items.;
  }
}
