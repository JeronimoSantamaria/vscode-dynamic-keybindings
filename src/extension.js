/*This File is meant to manage all the native commands in the extension*/
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const createKeybinding = require('../Test_Keybinding_creation/createKeybinding');

let dynamicKeybindingsEnabled = true;
let activeProfile = 'profile1';
let statusBarItem;

function updateStatusBar() {
    if (statusBarItem) {
        statusBarItem.text = `$(keyboard) ${dynamicKeybindingsEnabled ? 'Enabled' : 'Disabled'} - ${activeProfile}`;
        statusBarItem.show();
    }
}

function loadKeybindings(profile) {
    const keybindingsFilePath = path.join(__dirname, '..', 'keybinding-profiles', `${profile}.json`);
    if (fs.existsSync(keybindingsFilePath)) {
        const keybindings = JSON.parse(fs.readFileSync(keybindingsFilePath, 'utf8'));

        // Dynamically set the keybindings in the VS Code context
        vscode.commands.executeCommand('setContext', 'dynamicKeybindingsEnabled', dynamicKeybindingsEnabled);
        vscode.commands.executeCommand('setContext', 'activeProfile', profile);

        // Apply the keybindings (this is a conceptual step; VS Code doesn't allow runtime keybinding changes directly)
        vscode.window.showInformationMessage(`Keybindings for profile "${profile}" loaded successfully.`);
    } else {
        vscode.window.showErrorMessage(`Profile "${profile}" not found.`);
    }
}

function activate(context) {
    createKeybinding.activate(context);

    // Set initial context
    vscode.commands.executeCommand('setContext', 'dynamicKeybindingsEnabled', dynamicKeybindingsEnabled);
    vscode.commands.executeCommand('setContext', 'activeProfile', activeProfile);

    // Create a status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    context.subscriptions.push(statusBarItem);
    updateStatusBar();

    // Command to toggle dynamic keybindings
    let toggleDisposable = vscode.commands.registerCommand('dynamic-keybindings.toggle', function () {
        dynamicKeybindingsEnabled = !dynamicKeybindingsEnabled;
        vscode.commands.executeCommand('setContext', 'dynamicKeybindingsEnabled', dynamicKeybindingsEnabled);
        vscode.window.showInformationMessage(`Dynamic Keybindings ${dynamicKeybindingsEnabled ? 'Enabled' : 'Disabled'}`);
        updateStatusBar();
    });

    // Command to activate Profile 1
    let profile1Disposable = vscode.commands.registerCommand('dynamic-keybindings.profile1', function () {
        activeProfile = 'profile1';
        loadKeybindings(activeProfile);
        updateStatusBar();
    });

    // Command to activate Profile 2
    let profile2Disposable = vscode.commands.registerCommand('dynamic-keybindings.profile2', function () {
        activeProfile = 'profile2';
        loadKeybindings(activeProfile);
        updateStatusBar();
    });

    context.subscriptions.push(toggleDisposable, profile1Disposable, profile2Disposable);
}

function deactivate() {
    createKeybinding.deactivate();
}

module.exports = {
    activate,
    deactivate
};
