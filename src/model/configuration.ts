import { TerminalArray, isTerminalArray } from "./terminalArray";

export interface Configuration {
  windowsTerminals: TerminalArray;
  linuxTerminals: TerminalArray;
  osxTerminals: TerminalArray;
}

export function isConfiguration(object: unknown): object is Configuration {
  return (
    object instanceof Object &&
    object !== null &&
    isTerminalArray((object as Configuration).windowsTerminals) &&
    isTerminalArray((object as Configuration).linuxTerminals) &&
    isTerminalArray((object as Configuration).osxTerminals)
  );
}
