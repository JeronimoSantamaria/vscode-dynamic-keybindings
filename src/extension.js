const vscode = require('vscode');

let dynamicKeybindingsEnabled = true;
let activeProfile = 'profile1';
let statusBarItem;

function updateStatusBar() {
    if (statusBarItem) {
        statusBarItem.text = `$(keyboard) ${dynamicKeybindingsEnabled ? 'Enabled' : 'Disabled'} - ${activeProfile}`;
        statusBarItem.show();
    }
}

function activate(context) {
    vscode.commands.executeCommand('setContext', 'dynamicKeybindingsEnabled', dynamicKeybindingsEnabled);
    vscode.commands.executeCommand('setContext', 'activeProfile', activeProfile);

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    context.subscriptions.push(statusBarItem);
    updateStatusBar();

    let toggleDisposable = vscode.commands.registerCommand('dynamic-keybindings.toggle', function () {
        dynamicKeybindingsEnabled = !dynamicKeybindingsEnabled;
        vscode.commands.executeCommand('setContext', 'dynamicKeybindingsEnabled', dynamicKeybindingsEnabled);
        vscode.window.showInformationMessage(`Dynamic Keybindings ${dynamicKeybindingsEnabled ? 'Enabled' : 'Disabled'}`);
        updateStatusBar();
    });

    let profile1Disposable = vscode.commands.registerCommand('dynamic-keybindings.profile1', function () {
        activeProfile = 'profile1';
        vscode.commands.executeCommand('setContext', 'activeProfile', activeProfile);
        vscode.window.showInformationMessage('Profile 1 Activated');
        updateStatusBar();
    });

    let profile2Disposable = vscode.commands.registerCommand('dynamic-keybindings.profile2', function () {
        activeProfile = 'profile2';
        vscode.commands.executeCommand('setContext', 'activeProfile', activeProfile);
        vscode.window.showInformationMessage('Profile 2 Activated');
        updateStatusBar();
    });

    context.subscriptions.push(toggleDisposable, profile1Disposable, profile2Disposable);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
