import { State } from "./state";
import { ISimpleEvent } from "strongly-typed-events";
import { Terminal } from "./terminal";
import { OpenTerminalEventArgs } from "./eventArgs/openTerminalEventArgs";

/**
 * Defines extension behaviors and data.
 *
 * @export
 * @interface Context
 */
export interface Context {
  /**
   * Extension's state.
   *
   * @type {State}
   * @memberof Context
   */
  state: State;

  /**
   * Fires when a new open terminal is opened.
   *
   * @type {ISimpleEvent<OpenTerminalEventArgs>}
   * @memberof Context
   */
  onDidOpenTerminal: ISimpleEvent<OpenTerminalEventArgs>;

  /**
   * Asks for a shell template to sets as default integrated shell.
   *
   * @returns {Promise<void>}
   * @memberof Context
   */
  askAndSetDefaultTerminal(): Promise<void>;

  /**
   * Asks for a shell template to sets as default *workspace* integrated shell.
   *
   * @returns {Promise<void>}
   * @memberof Context
   */
  askAndSetWorkspaceDefault(): Promise<void>;

  /**
   * Asks for a shell template to open as a new integrated shell.
   *
   * @returns {Promise<void>}
   * @memberof Context
   */
  askAndOpenTerminal(): Promise<void>;

  /**
   * Asks for a shell template to open as a new integrated shell. The user is
   * also asked to set a title for the new terminal.
   *
   * @returns {Promise<void>}
   * @memberof Context
   */
  askAndOpenEntitledTerminal(): Promise<void>;

  /**
   * Lists open terminals and switches to the selected terminal.
   *
   * @returns {Promise<vscode.Terminal | undefined>} A Promise that resolves
   *  with the selected `vscode.Terminal`, if any; otherwise, resolve with
   *  `undefined`. If there was no open terminal, the method returns
   *  `undefined`.
   * @memberof Context
   */
  askAndSwitchTerminal(): Promise<void>;

  /**
   * Switches to the next open terminal.
   *
   * @returns {Promise<void>}
   * @memberof Context
   */
  switchNextTerminal(): Promise<void>;

  /**
   * Closes all open terminals.
   *
   * @returns {Promise<void>}
   * @memberof Context
   */
  killAllTerminals(): Promise<void>;

  /**
   * Closes current open terminal.
   *
   * @returns {Promise<void>}
   * @memberof Context
   */
  killCurrentTerminal(): Promise<void>;
}
