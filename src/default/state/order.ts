import { isStringArray } from "../../model/terminal";

export type Order = string[];

export function isOrder(object: unknown): object is Order {
  return isStringArray(object);
}
