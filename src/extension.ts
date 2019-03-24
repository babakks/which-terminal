import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Extension is being activated.");

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.changeDefaultTerminal",
      changeDefaultTerminalCommand
    )
  );

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );

  statusBarItem.command = "extension.changeDefaultTerminal";
  statusBarItem.text = "$(light-bulb) Default Terminal: ?";
  statusBarItem.show();
}

export function deactivate() {}

async function changeDefaultTerminalCommand(): Promise<void> {
  const config = vscode.workspace.getConfiguration("which-terminal");
  const terminals = config.windowsTerminals;
  if (!Array.isArray(terminals) || !terminals.length) {
    return;
  }

  const options: vscode.QuickPickOptions = {
    placeHolder: "New default terminal"
  };

  const titles = terminals.map(x => x.title);
  const selection = await vscode.window.showQuickPick(titles, options);

  if (!selection) {
    return;
  }

  vscode.window.showInformationMessage(selection);
}
