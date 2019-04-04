import { Terminal, isTerminal, EnvironmentData } from "../model/terminal";

export class DefaultTerminal implements Terminal {
  constructor(
    public shell: string,
    public shellArgs?: string[],
    public cwd?: string,
    public title?: string,
    public env?: EnvironmentData,
    public init?: string[]
  ) {}

  static from(object: unknown): DefaultTerminal {
    if (!isTerminal(object)) {
      throw new Error("Argument is not a `Terminal` object.");
    }

    return new DefaultTerminal(
      object.shell,
      object.shellArgs,
      object.cwd,
      object.title,
      object.env,
      object.init
    );
  }
}
