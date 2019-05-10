import { Platform, onPlatform, getPlatform } from "./platform";
import { Order, isOrder } from "../../model/order";
import { State } from "../../model/state";
import * as vscode from "vscode";

/**
 * Encapsulates `DefaultContext` state.
 *
 * @export
 * @class DefaultState
 */
export class DefaultState implements State {
  platform: Platform;

  constructor(private vscodeContext: vscode.ExtensionContext) {
    this.platform = getPlatform();
  }

  get order(): Order {
    const value = this.vscodeContext.workspaceState.get(
      onPlatform(
        this.platform,
        "windowsTerminalsOrder",
        "osxTerminalsOrder",
        "linuxTerminalsOrder"
      )
    );

    return isOrder(value) ? value : [];
  }

  set order(value: Order) {
    this.vscodeContext.workspaceState.update(
      onPlatform(
        this.platform,
        "windowsTerminalsOrder",
        "osxTerminalsOrder",
        "linuxTerminalsOrder"
      ),
      value
    );
  }
}
