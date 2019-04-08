export interface Terminal {
  id: string;
  title?: string;
  cwd?: string;
  shell: string;
  shellArgs?: string[];
  env?: EnvironmentData;
  init?: string[];
}

export function isStringArray(object: unknown): object is string[] {
  return Array.isArray(object) && object.every(x => typeof x === "string");
}

export type EnvironmentData = { [key: string]: string | null };

export function isEnvironmentData(object: unknown): object is EnvironmentData {
  return (
    object instanceof Object &&
    object !== null &&
    Object.keys(object).every(x => typeof (object as any)[x] === "string")
  );
}

export function isTerminal(object: unknown): object is Terminal {
  const potentialTerminal = object as Terminal;
  return (
    object instanceof Object &&
    object !== null &&
    typeof potentialTerminal.id === "string" &&
    potentialTerminal.id !== "" &&
    typeof potentialTerminal.shell === "string" &&
    (potentialTerminal.title === undefined ||
      typeof potentialTerminal.title === "string") &&
    (potentialTerminal.cwd === undefined ||
      typeof potentialTerminal.cwd === "string") &&
    (potentialTerminal.shellArgs === undefined ||
      isStringArray(potentialTerminal.shellArgs)) &&
    (potentialTerminal.env === undefined ||
      isEnvironmentData(potentialTerminal.env)) &&
    (potentialTerminal.init === undefined ||
      isStringArray(potentialTerminal.init))
  );
}
