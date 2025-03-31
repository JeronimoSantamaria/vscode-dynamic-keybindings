const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) { // Define the open webview command
  context.subscriptions.push(
    vscode.commands.registerCommand('dynamic-keybindings.openWebview', async function () {
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

function getWebviewContent() { // Define the HTML content for the webview
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dynamic Keybindings</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        input { display: block; margin-bottom: 10px; width: 100%; padding: 8px; max-width: 50px; }
        button { padding: 10px 20px; }
      </style>
    </head>
    <body>
      <h1>Dynamic Keybindings</h1>
      <p>Welcome to the Dynamic Keybindings webview!</p>
      <p>Here you can create custom keybindings for your workflow.</p>
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
  // Get the values from the webview and create a keybinding with the provided template
  if (redirectedKey && destinationText && activeProfileParameter) {
    const template = `{
            "key": "${redirectedKey}", 
            "command": "type",
            "args": {
              "text": "${destinationText}"
            },
            "when": "dynamicKeybindingsEnabled && activeProfile == '${activeProfileParameter}'"
        },`;

    const keybindingsFilePath = path.join(__dirname, 'storageKeybindings.json'); // Define the path to the keybindings file
    fs.appendFileSync(keybindingsFilePath, template + '\n', 'utf8');
    vscode.window.showInformationMessage('Keybinding created successfully!'); // Show a success message
  } else { // Check if all fields are filled before creating the keybinding
    vscode.window.showErrorMessage('All fields are required to create a keybinding.');
  }
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};
