/**
 * Defines extension behaviors and data.
 *
 * @export
 * @interface Context
 */
export interface Context {
  /**
   * Asks for a shell template to sets as default integrated shell.
   *
   * @returns {Promise<void>}
   * @memberof Context
   */
  askAndSetDefault(): Promise<void>;

  /**
   * Asks for a shell template to open as a new integrated shell.
   *
   * @returns {Promise<void>}
   * @memberof Context
   */
  askAndOpenTerminal(): Promise<void>;

  /**
   * Lists open terminals and switches to the selected terminal.
   *
   * @returns {Promise<vscode.Terminal | undefined>} A Promise that resolves
   *  with the selected `vscode.Terminal`, if any; otherwise, resolve with
   *  `undefined`. If there was no open terminal, the method returns
   *  `undefined`.
   * @memberof Context
   */
  switchTerminal(): Promise<void>;
}
