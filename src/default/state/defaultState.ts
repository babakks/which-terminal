import { Platform, onPlatform, getPlatform } from "../../model/platform";
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
  constructor(
    private platform: Platform,
    private vscodeContext: vscode.ExtensionContext
  ) {}

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
