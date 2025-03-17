const vscode = require('vscode');

let dynamicKeybindingsEnabled = true;

function activate(context) {
    vscode.commands.executeCommand('setContext', 'dynamicKeybindingsEnabled', dynamicKeybindingsEnabled);

    let disposable = vscode.commands.registerCommand('dynamic-keybindings.toggle', function () {
        dynamicKeybindingsEnabled = !dynamicKeybindingsEnabled;
        vscode.commands.executeCommand('setContext', 'dynamicKeybindingsEnabled', dynamicKeybindingsEnabled);
        vscode.window.showInformationMessage(`Dynamic Keybindings ${dynamicKeybindingsEnabled ? 'Enabled' : 'Disabled'}`);
    });

    context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
