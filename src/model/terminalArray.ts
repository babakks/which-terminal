import { Terminal, isTerminal } from "./terminal";

export interface TerminalArray extends Array<Terminal> {}

export function isTerminalArray(object: unknown): object is TerminalArray {
  return Array.isArray(object) && object.every(x => isTerminal(x));
}
