const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.createKeybinding', async function () {
            const panel = vscode.window.createWebviewPanel(
                'dynamicKeybindingsWebview',
                'Dynamic Keybindings',
                vscode.ViewColumn.One,
                {
                    enableScripts: true
                }
            );

            panel.webview.html = getWebviewContent();

            panel.webview.onDidReceiveMessage(
                message => {
                    switch (message.command) {
                        case 'createKeybinding':
                            createKeybinding(message.redirectedKey, message.destinationText, message.activeProfileParameter);
                            return;
                    }
                },
                undefined,
                context.subscriptions
            );
        })
    );
}

function getWebviewContent() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dynamic Keybindings</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        input { display: block; margin-bottom: 10px; width: 100%; padding: 8px; }
        button { padding: 10px 20px; }
      </style>
    </head>
    <body>
      <h1>Dynamic Keybindings</h1>
      <p>Welcome to the Dynamic Keybindings webview!</p>
      <form id="keybindingForm">
        <label for="redirectedKey">Redirected Key:</label>
        <input type="text" id="redirectedKey" name="redirectedKey" required>
        <label for="destinationText">Destination Text:</label>
        <input type="text" id="destinationText" name="destinationText" required>
        <label for="activeProfileParameter">Active Profile Parameter:</label>
        <input type="text" id="activeProfileParameter" name="activeProfileParameter" required>
        <button type="submit">Create Keybinding</button>
      </form>
      <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('keybindingForm').addEventListener('submit', (event) => {
          event.preventDefault();
          const redirectedKey = document.getElementById('redirectedKey').value;
          const destinationText = document.getElementById('destinationText').value;
          const activeProfileParameter = document.getElementById('activeProfileParameter').value;
          vscode.postMessage({
            command: 'createKeybinding',
            redirectedKey,
            destinationText,
            activeProfileParameter
          });
        });
      </script>
    </body>
    </html>
  `;
}

function createKeybinding(redirectedKey, destinationText, activeProfileParameter) {
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
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
