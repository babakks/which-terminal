import * as vscode from "vscode";
import { Terminal } from "../model/terminal";
import { VisualTerminal } from "../model/visualTerminal";

export class DefaultVisualTerminal implements VisualTerminal {
  /**
   * Creates an instance of `DefaultVisualTerminal`.

   * @param {Terminal} terminal Terminal model associated to the visually
   *   created terminal.
   * @param {vscode.Terminal} vsCodeTerminal Visually created model of the
   *   terminal.
   * @memberof DefaultVisualTerminal
   */
  constructor(
    public terminal: Terminal,
    public vsCodeTerminal: vscode.Terminal
  ) {}
}
