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

function loadProfiles() {
    const config = vscode.workspace.getConfiguration('dynamic-keybindings');
    return config.get('profiles', []);
}

function applyProfile(profileName) {
    const profiles = loadProfiles();
    const profile = profiles.find(p => p.name === profileName);
    if (profile) {
        profile.keybindings.forEach(kb => {
            vscode.commands.executeCommand('setContext', kb.when, true);
        });
    }
}

function displayProfiles() {
    const profiles = loadProfiles();
    let profileList = profiles.map(profile => {
        let keybindingsList = profile.keybindings.map(kb => {
            return `  ${kb.key} -> ${kb.args.text}`;
        }).join('\n');
        return `${profile.name}:\n${keybindingsList}`;
    }).join('\n\n');
    vscode.window.showInformationMessage(profileList);
}

function updateProfileDisplay() {
    const profiles = loadProfiles();
    let profileDisplay = profiles.map(profile => {
        let keybindingsList = profile.keybindings.map(kb => {
            let argsText = kb.args ? JSON.stringify(kb.args) : 'No args';
            return `- Key "${kb.key}" => ${argsText}`;
        }).join('\n');
        return `${profile.name}:\n${keybindingsList}`;
    }).join('\n\n');
    vscode.workspace.getConfiguration('dynamic-keybindings').update('profileDisplay', profileDisplay, vscode.ConfigurationTarget.Global);
}

function addKeybinding(profileName, key, command, args, when) {
    const profiles = loadProfiles();
    const profile = profiles.find(p => p.name === profileName);
    if (profile) {
        profile.keybindings.push({ key, command, args, when });
        vscode.workspace.getConfiguration('dynamic-keybindings').update('profiles', profiles, vscode.ConfigurationTarget.Global);
        updateProfileDisplay();
        vscode.window.showInformationMessage(`Keybinding added to ${profileName}`);
    } else {
        vscode.window.showErrorMessage(`Profile ${profileName} not found`);
    }
}

function activate(context) {
    vscode.commands.executeCommand('setContext', 'dynamicKeybindingsEnabled', dynamicKeybindingsEnabled);
    vscode.commands.executeCommand('setContext', 'activeProfile', activeProfile);

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    context.subscriptions.push(statusBarItem);
    updateStatusBar();

    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('dynamic-keybindings.profiles')) {
            applyProfile(activeProfile);
            updateProfileDisplay();
        }
    });

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
        applyProfile(activeProfile);
        updateStatusBar();
    });

    let profile2Disposable = vscode.commands.registerCommand('dynamic-keybindings.profile2', function () {
        activeProfile = 'profile2';
        vscode.commands.executeCommand('setContext', 'activeProfile', activeProfile);
        vscode.window.showInformationMessage('Profile 2 Activated');
        applyProfile(activeProfile);
        updateStatusBar();
    });

    let displayProfilesDisposable = vscode.commands.registerCommand('dynamic-keybindings.displayProfiles', function () {
        displayProfiles();
    });

    let addKeybindingDisposable = vscode.commands.registerCommand('dynamic-keybindings.addKeybinding', async function () {
        const profileName = await vscode.window.showInputBox({ prompt: 'Enter profile name' });
        const key = await vscode.window.showInputBox({ prompt: 'Enter key combination' });
        const command = await vscode.window.showInputBox({ prompt: 'Enter command to execute' });
        const args = await vscode.window.showInputBox({ prompt: 'Enter arguments (JSON format)' });
        const when = await vscode.window.showInputBox({ prompt: 'Enter condition when the keybinding is active' });

        if (profileName && key && command) {
            let parsedArgs;
            try {
                parsedArgs = args ? JSON.parse(args) : undefined;
            } catch (error) {
                vscode.window.showErrorMessage('Invalid JSON format for arguments');
                return;
            }
            addKeybinding(profileName, key, command, parsedArgs, when);
        } else {
            vscode.window.showErrorMessage('Profile name, key combination, and command are required');
        }
    });

    context.subscriptions.push(toggleDisposable, profile1Disposable, profile2Disposable, displayProfilesDisposable, addKeybindingDisposable);

    updateProfileDisplay();
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
