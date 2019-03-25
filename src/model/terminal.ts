export interface Terminal {
  title?: string;
  shell: string;
  shellArgs?: string[];
}

export function isTerminal(object: any): object is Terminal {
  return "shell" in object;
}
