import * as vscode from "vscode";
import { FakeMemento } from "./fakeMemento";

/**
 * Implements a fake, in-memory `ExtensionContext`.
 *
 * @export
 * @class FakeExtensionContext
 * @implements {vscode.ExtensionContext}
 */
export class FakeExtensionContext implements vscode.ExtensionContext {
  /**
   * An array to which disposables can be added. When this
   * extension is deactivated the disposables will be disposed.
   */
  subscriptions: { dispose(): any }[] = [];

  /**
   * A memento object that stores state in the context
   * of the currently opened [workspace](#workspace.workspaceFolders).
   */
  workspaceState: FakeMemento = new FakeMemento();

  /**
   * A memento object that stores state independent
   * of the current opened [workspace](#workspace.workspaceFolders).
   */
  globalState: FakeMemento = new FakeMemento();

  /**
   * The absolute file path of the directory containing the extension.
   */
  extensionPath: string = "";

  /**
   * Get the absolute path of a resource contained in the extension.
   *
   * @param relativePath A relative path to a resource contained in the extension.
   * @return The absolute path of the resource.
   */
  asAbsolutePath(relativePath: string): string {
    return relativePath;
  }

  /**
   * An absolute file path of a workspace specific directory in which the extension
   * can store private state. The directory might not exist on disk and creation is
   * up to the extension. However, the parent directory is guaranteed to be existent.
   *
   * Use [`workspaceState`](#ExtensionContext.workspaceState) or
   * [`globalState`](#ExtensionContext.globalState) to store key value data.
   */
  storagePath: string | undefined = "";

  /**
   * An absolute file path in which the extension can store global state.
   * The directory might not exist on disk and creation is
   * up to the extension. However, the parent directory is guaranteed to be existent.
   *
   * Use [`globalState`](#ExtensionContext.globalState) to store key value data.
   */
  globalStoragePath: string = "";

  /**
   * An absolute file path of a directory in which the extension can create log files.
   * The directory might not exist on disk and creation is up to the extension. However,
   * the parent directory is guaranteed to be existent.
   */
  logPath: string = "";
}
