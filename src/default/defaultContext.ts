import { Context } from "../model/context";
import { Configuration } from "../model/configuration";
import { DefaultConfiguration } from "./defaultConfiguration";
import { TerminalArray } from "../model/terminalArray";
import { Platform, getPlatform, onPlatform } from "./state/platform";
import { isOrder } from "./state/order";
import { DefaultTerminalArray } from "./DefaultTerminalArray";
import { Terminal } from "../model/terminal";

import * as vscode from "vscode";
import * as nls from "vscode-nls";
import { State } from "./state/state";

const localize = nls.config()();

/**
 * Default extension `Context` implementation.
 *
 * @export
 * @interface Context
 */
export class DefaultContext implements Context {
  /**
   * Current running platform.
   *
   * @private
   * @type {Platform}
   * @memberof DefaultContext
   */
  private platform: Platform;

  /**
   * Current extension state.
   *
   * @private
   * @type {State}
   * @memberof DefaultContext
   */
  private state: State;

  /**
   * Creates an instance of `DefaultContext`.
   *
   * @param {vscode.ExtensionContext} vscodeContext VS Code original context
   *   object.
   * @memberof DefaultContext
   */
  constructor(private vscodeContext: vscode.ExtensionContext) {
    this.platform = getPlatform();
    this.state = new State(this.vscodeContext);
  }

  /**
   * Asks for a shell template to sets as default integrated shell.
   *
   * @returns {Promise<void>}
   * @memberof DefaultContext
   */
  async askAndSetDefault(): Promise<void> {
    const terminal = await this.quickPickTerminal(true);

    throw new Error("Not implemented.");
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
   * @returns {(Promise<Terminal | undefined>)} Returns a `Promise` that
   *   resolves with the selected `Terminal`, if any; otherwise, resolves with
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
            "Select default terminal"
          )
        : localize("quickPickSelectTerminalPlaceHolder", "Select terminal")
    };

    const icon = "$(terminal)";
    const prefix = icon + " ";
    // const makeTitle = (t: Terminal) => prefix + (t.title || t.shell);
    // const makeEntry = (t: Terminal): [string, Terminal] => [makeTitle(t), t];
    // const map = new Map(terminals.map(makeEntry));
    // const titles = Array.from(map.keys());

    const makeQuickPickItem = (t: Terminal): vscode.QuickPickItem => ({
      label: prefix + (t.title || t.shell),
      description: t.title ? t.shell : ""
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

    return result;
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
