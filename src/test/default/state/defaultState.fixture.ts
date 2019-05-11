import { DefaultState } from "../../../default/state/defaultState";
import { Platform } from "../../../model/platform";
import * as vscode from "vscode";
import { FakeExtensionContext } from "./fakeExtensionContext";

/**
 * Creates a test fixture for the `DefaultState` class (in `subject` property)
 * with the following attributes:
 *   1. `order = ["*1", "*2"]` where `*` stands for the platform; `"windows"`,
 *      `"osx"`, or `"linux"`.
 *
 * @export
 * @class DefaultStateSimpleFixture
 */
export class DefaultStateSimpleFixture {
  subject: DefaultState;

  constructor(platform: Platform) {
    const context = new FakeExtensionContext();
    const windowsItems = ["windows1", "windows2"];
    const osxItems = ["osx1", "osx2"];
    const linuxItems = ["linux1", "linux2"];

    switch (platform) {
      case Platform.Windows:
        context.workspaceState.update("windowsTerminalsOrder", windowsItems);
      case Platform.Osx:
        context.workspaceState.update("osxTerminalsOrder", osxItems);
      case Platform.Linux:
        context.workspaceState.update("linuxTerminalsOrder", linuxItems);
    }

    this.subject = new DefaultState(platform, context);
  }
}
