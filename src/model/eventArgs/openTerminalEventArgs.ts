import { VisualTerminal } from "../visualTerminal";

export class OpenTerminalEventArgs {
  /**
   * Creates an instance of `OpenTerminalEventArgs`.

   * @param {VisualTerminal} visualTerminal
   * @memberof OpenTerminalEventArgs
   */
  constructor(public visualTerminal: VisualTerminal) {}
}
