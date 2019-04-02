export interface Terminal {
  title?: string;
  shell: string;
  shellArgs?: string[];
  env?: object;
}

export function isTerminal(object: unknown): object is Terminal {
  return (
    object instanceof Object &&
    object !== null &&
    typeof (object as Terminal).shell === "string"
  );
}

export function isTerminalArray(object: unknown): object is Terminal[] {
  return Array.isArray(object) && object.every(x => isTerminal(x));
}
