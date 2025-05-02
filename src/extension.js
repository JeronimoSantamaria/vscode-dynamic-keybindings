const vscode = require('vscode');
const createKeybinding = require('../Keybinding-Creation/createKeybinding');
const setupWizard = require('./setupWizard');

let dynamicKeybindingsEnabled = false;
let activeProfile = 'P0'; // Default profile ID
let statusBarItem;
let profiles = {};

function updateStatusBar() {
    if (statusBarItem) {
        const profileName = profiles[activeProfile] || 'Unknown Profile';
        statusBarItem.text = `$(keyboard) ${dynamicKeybindingsEnabled ? 'Enabled' : 'Disabled'} - ${profileName}`;
        statusBarItem.show();
    }
}

function registerProfileCommand(context, profileId, profileName) {
    // Register the command
    let profileDisposable = vscode.commands.registerCommand(`dynamic-keybindings.${profileId}`, function () {
        activeProfile = profileId;
        vscode.commands.executeCommand('setContext', 'activeProfile', activeProfile);
        vscode.window.showInformationMessage(`${profileName} Activated`);
        updateStatusBar();
    });
    context.subscriptions.push(profileDisposable);

    // Register the keybinding
    const keybinding = vscode.commands.registerCommand(`dynamic-keybindings.${profileId}.keybinding`, () => {
        vscode.commands.executeCommand(`dynamic-keybindings.${profileId}`);
    });
    context.subscriptions.push(keybinding);
}

function activate(context) {
    // Check if this is the first run
    const hasShownSetup = context.globalState.get('hasShownSetup', false);
    if (!hasShownSetup) {
        setupWizard.showSetupWizard();
        context.globalState.update('hasShownSetup', true);
    }

    // Register the manual setup wizard command
    let setupDisposable = vscode.commands.registerCommand('dynamic-keybindings.showSetup', function () {
        setupWizard.showSetupWizard();
    });
    context.subscriptions.push(setupDisposable);

    // Load profiles from global state
    profiles = createKeybinding.loadProfiles(context);
    createKeybinding.activate(context);

    // Set initial context
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

    // Register commands for all profiles
    Object.entries(profiles).forEach(([profileId, profileName]) => {
        registerProfileCommand(context, profileId, profileName);
    });

    context.subscriptions.push(toggleDisposable);
}

function deactivate() {
    createKeybinding.deactivate();
}

module.exports = {
    activate,
    deactivate
};
