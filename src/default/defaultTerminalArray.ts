import { DefaultTerminal } from "./defaultTerminal";
import { TerminalArray, isTerminalArray } from "../model/terminalArray";

export class DefaultTerminalArray extends Array<DefaultTerminal>
  implements TerminalArray {
  constructor(...items: DefaultTerminal[]) {
    super(...items);
  }

  static populateFrom(
    object: unknown,
    sort: boolean = true
  ): DefaultTerminalArray {
    if (!isTerminalArray(object)) {
      throw new Error("Argument is not a `Configuration` object.");
    }

    const items = object.map(x => DefaultTerminal.from(x));

    return !sort
      ? new DefaultTerminalArray(...items)
      : new DefaultTerminalArray(
          ...items.sort((a, b) => a.id.localeCompare(b.id))
        );
  }
}
