import * as vscode from "vscode";
import { Terminal } from "./terminal";

/**
 * Defines an interface for visually created terminals to serve as a view-model.
 *
 * @export
 * @interface VisualTerminal
 */
export interface VisualTerminal {
  
  /**
   * Terminal model associated to the visually created terminal.
   *
   * @type {Terminal}
   * @memberof VisualTerminal
   */
  terminal: Terminal;

  /**
   * Visually created model of the terminal.
   *
   * @type {vscode.Terminal}
   * @memberof VisualTerminal
   */
  vsCodeTerminal: vscode.Terminal;
}
