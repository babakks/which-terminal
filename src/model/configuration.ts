import { TerminalArray, isTerminalArray } from "./terminalArray";

export interface Configuration {
  recentTerminalsListSize: number;
  windowsTerminals: TerminalArray;
  linuxTerminals: TerminalArray;
  osxTerminals: TerminalArray;
}

export function isConfiguration(object: unknown): object is Configuration {
  return (
    object instanceof Object &&
    object !== null &&
    typeof (object as Configuration).recentTerminalsListSize === "number" &&
    isTerminalArray((object as Configuration).windowsTerminals) &&
    isTerminalArray((object as Configuration).linuxTerminals) &&
    isTerminalArray((object as Configuration).osxTerminals)
  );
}
