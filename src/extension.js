const vscode = require('vscode');

let dynamicKeybindingsEnabled = true;
let activeProfile = 'profile1';

function activate(context) {
    vscode.commands.executeCommand('setContext', 'dynamicKeybindingsEnabled', dynamicKeybindingsEnabled);
    vscode.commands.executeCommand('setContext', 'activeProfile', activeProfile);

    let toggleDisposable = vscode.commands.registerCommand('dynamic-keybindings.toggle', function () {
        dynamicKeybindingsEnabled = !dynamicKeybindingsEnabled;
        vscode.commands.executeCommand('setContext', 'dynamicKeybindingsEnabled', dynamicKeybindingsEnabled);
        vscode.window.showInformationMessage(`Dynamic Keybindings ${dynamicKeybindingsEnabled ? 'Enabled' : 'Disabled'}`);
    });

    let profile1Disposable = vscode.commands.registerCommand('dynamic-keybindings.profile1', function () {
        activeProfile = 'profile1';
        vscode.commands.executeCommand('setContext', 'activeProfile', activeProfile);
        vscode.window.showInformationMessage('Profile 1 Activated');
    });

    let profile2Disposable = vscode.commands.registerCommand('dynamic-keybindings.profile2', function () {
        activeProfile = 'profile2';
        vscode.commands.executeCommand('setContext', 'activeProfile', activeProfile);
        vscode.window.showInformationMessage('Profile 2 Activated');
    });

    context.subscriptions.push(toggleDisposable, profile1Disposable, profile2Disposable);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
