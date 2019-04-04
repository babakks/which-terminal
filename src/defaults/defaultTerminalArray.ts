import { DefaultTerminal } from "./defaultTerminal";
import { TerminalArray, isTerminalArray } from "../model/terminalArray";

export class DefaultTerminalArray extends Array<DefaultTerminal>
  implements TerminalArray {
  constructor(...items: DefaultTerminal[]) {
    super(...items);
  }

  static from(object: unknown): DefaultTerminalArray {
    if (!isTerminalArray(object)) {
      throw new Error("Argument is not a `Configuration` object.");
    }

    return new DefaultTerminalArray(
      ...object.map(x => DefaultTerminal.from(x))
    );
  }
}
