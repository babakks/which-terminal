import { Configuration, isConfiguration } from "../model/configuration";
import { Terminal } from "../model/terminal";
import { DefaultTerminal } from "./defaultTerminal";
import { TerminalArray } from "../model/terminalArray";
import { DefaultTerminalArray } from "./DefaultTerminalArray";

export class DefaultConfiguration implements Configuration {
  constructor(
    public windowsTerminals: TerminalArray,
    public linuxTerminals: TerminalArray,
    public osxTerminals: TerminalArray
  ) {}

  static from(object: unknown): DefaultConfiguration {
    if (!isConfiguration(object)) {
      throw new Error("Argument is not a `Configuration` object.");
    }

    return new DefaultConfiguration(
      DefaultTerminalArray.from(object.windowsTerminals),
      DefaultTerminalArray.from(object.osxTerminals),
      DefaultTerminalArray.from(object.linuxTerminals)
    );
  }
}
