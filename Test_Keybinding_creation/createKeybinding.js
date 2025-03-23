const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.createKeybinding', async function () {
        const redirectedKey = await vscode.window.showInputBox({ prompt: 'Enter the redirected key' });
        const destinationText = await vscode.window.showInputBox({ prompt: 'Enter the destination text' });
        const activeProfileParameter = await vscode.window.showInputBox({ prompt: 'Enter the active profile parameter' });

        if (redirectedKey && destinationText && activeProfileParameter) {
            const template = `{
                "key": "${redirectedKey}", 
                "command": "type",
                "args": {
                  "text": "${destinationText}"
                },
                "when": "dynamicKeybindingsEnabled && activeProfile == '${activeProfileParameter}'"
            },`;

            const keybindingsFilePath = path.join(__dirname, 'testKeybindings.json');
            fs.appendFileSync(keybindingsFilePath, template + '\n', 'utf8');
            vscode.window.showInformationMessage('Keybinding created successfully!');
        } else {
            vscode.window.showErrorMessage('All fields are required to create a keybinding.');
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
