const vscode = require('vscode');
const createKeybinding = require('../Keybinding-Creation/createKeybinding');

let dynamicKeybindingsEnabled = false; // Define the initial state of dynamic keybindings
let activeProfile = 'profile1'; // Define the initial profile
let statusBarItem; // Status bar item to show the current state of dynamic keybindings

function updateStatusBar() { // Update the status bar item with the current state of dynamic keybindings and active profile
    if (statusBarItem) {
        statusBarItem.text = `$(keyboard) ${dynamicKeybindingsEnabled ? 'Enabled' : 'Disabled'} - ${activeProfile}`;
        statusBarItem.show();
    }
}

function activate(context) { // Define the status and create the bar item to show the current state of dynamic keybindings and active profile
    createKeybinding.activate(context);
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

    context.subscriptions.push(toggleDisposable);

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

    context.subscriptions.push(profile1Disposable, profile2Disposable);
}

function deactivate() {
    createKeybinding.deactivate();
}

module.exports = {
    activate,
    deactivate
};
