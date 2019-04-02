import { Terminal, isTerminal } from "../model/terminal";

export class DefaultTerminal implements Terminal {
  constructor(
    public shell: string,
    public shellArgs?: string[],
    public title?: string,
    public env?: object
  ) {}

  static from(object: unknown): DefaultTerminal {
    if (!isTerminal(object)) {
      throw new Error("Input is not a `Terminal` object.");
    }

    return new DefaultTerminal(
      object.shell,
      object.shellArgs,
      object.title,
      object.env
    );
  }
}
