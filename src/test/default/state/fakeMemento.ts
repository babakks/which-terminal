import * as vscode from "vscode";

/**
 * Implements a fake, in-memory  `Memento`.
 *
 * @export
 * @class FakeMemento
 * @implements {vscode.Memento}
 */
export class FakeMemento implements vscode.Memento {
  private memo = new Map<string, string>();

  /**
   * Return a value.
   *
   * @param key A string.
   * @return The stored value or `undefined`.
   */
  get<T>(key: string): T | undefined;

  /**
   * Return a value.
   *
   * @param key A string.
   * @param defaultValue A value that should be returned when there is no
   * value (`undefined`) with the given key.
   * @return The stored value or the defaultValue.
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    const value = this.memo.get(key);
    return value ? (JSON.parse(value) as T) : defaultValue;
  }

  /**
   * Store a value. The value must be JSON-stringifyable.
   *
   * @param key A string.
   * @param value A value. MUST not contain cyclic references.
   */
  update(key: string, value: any): Thenable<void> {
    this.memo.set(key, JSON.stringify(value));
    return Promise.resolve();
  }
}
