import { Configuration, isConfiguration } from "../model/configuration";
import { TerminalArray } from "../model/terminalArray";
import { DefaultTerminalArray } from "./defaultTerminalArray";

export class DefaultConfiguration implements Configuration {
  constructor(
    public recentTerminalsListSize: number,



    
    public windowsTerminals: TerminalArray,
    public linuxTerminals: TerminalArray,
    public osxTerminals: TerminalArray
  ) {}

  static from(object: unknown): DefaultConfiguration {
    if (!isConfiguration(object)) {
      throw new Error("Argument is not a `Configuration` object.");
    }

    return new DefaultConfiguration(
      object.recentTerminalsListSize,
      DefaultTerminalArray.populateFrom(object.windowsTerminals),
      DefaultTerminalArray.populateFrom(object.osxTerminals),
      DefaultTerminalArray.populateFrom(object.linuxTerminals)
    );
  }
}
