const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

let profiles = { P0: 'Default Profile' }; // Dictionary to store profiles

function activate(context) {
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
            case 'addProfile':
              addProfile(message.profileName);
              panel.webview.postMessage({ command: 'updateProfiles', profiles });
              return;
            case 'deleteProfile':
              deleteProfile(message.profileId);
              panel.webview.postMessage({ command: 'updateProfiles', profiles });
              return;
          }
        },
        undefined,
        context.subscriptions
      );

      // Send initial profiles to the webview
      panel.webview.postMessage({ command: 'updateProfiles', profiles });
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
        input, select { display: block; margin-bottom: 10px; width: 100%; padding: 8px; }
        button { padding: 10px 20px; margin-right: 10px; }
      </style>
    </head>
    <body>
      <h1>Dynamic Keybindings</h1>
      <p>Manage your profiles and create custom keybindings.</p>
      
      <h2>Profiles</h2>
      <ul id="profileList"></ul>
      <input type="text" id="newProfileName" placeholder="New Profile Name">
      <button id="addProfileButton">Add Profile</button>

      <h2>Create Keybinding</h2>
      <form id="keybindingForm">
        <label for="redirectedKey">Redirected Key:</label>
        <input type="text" id="redirectedKey" name="redirectedKey" required> 
        <label for="destinationText">Destination Text:</label>
        <input type="text" id="destinationText" name="destinationText" required>
        <label for="activeProfileParameter">Active Profile:</label>
        <select id="activeProfileParameter" name="activeProfileParameter"></select>
        <button type="submit">Create Keybinding</button>
      </form>

      <script>
        const vscode = acquireVsCodeApi();

        const profileList = document.getElementById('profileList');
        const activeProfileSelect = document.getElementById('activeProfileParameter');
        const newProfileNameInput = document.getElementById('newProfileName');
        const addProfileButton = document.getElementById('addProfileButton');

        // Handle adding a new profile
        addProfileButton.addEventListener('click', () => {
          const profileName = newProfileNameInput.value.trim();
          if (profileName) {
            vscode.postMessage({ command: 'addProfile', profileName });
            newProfileNameInput.value = '';
          }
        });

        // Handle deleting a profile
        profileList.addEventListener('click', (event) => {
          if (event.target.classList.contains('delete-profile')) {
            const profileId = event.target.dataset.profileId;
            vscode.postMessage({ command: 'deleteProfile', profileId });
          }
        });

        // Handle creating a keybinding
        document.getElementById('keybindingForm').addEventListener('submit', (event) => {
          event.preventDefault();
          const redirectedKey = document.getElementById('redirectedKey').value;
          const destinationText = document.getElementById('destinationText').value;
          const activeProfileParameter = activeProfileSelect.value;
          vscode.postMessage({
            command: 'createKeybinding',
            redirectedKey,
            destinationText,
            activeProfileParameter
          });

          document.getElementById('keybindingForm').reset();
        });

        // Update profiles in the UI
        window.addEventListener('message', (event) => {
          const message = event.data;
          if (message.command === 'updateProfiles') {
            const profiles = message.profiles;
            profileList.innerHTML = '';
            activeProfileSelect.innerHTML = '';
            for (const [id, name] of Object.entries(profiles)) {
              const li = document.createElement('li');
              li.textContent = \`\${name} (\${id})\`;
              li.innerHTML += \` <button class="delete-profile" data-profile-id="\${id}">Delete</button>\`;
              profileList.appendChild(li);

              const option = document.createElement('option');
              option.value = id;
              option.textContent = name;
              activeProfileSelect.appendChild(option);
            }
          }
        });
      </script>
    </body>
    </html>
  `;
}

function addProfile(profileName) {
  const profileId = `P${Object.keys(profiles).length}`;
  profiles[profileId] = profileName;

  // Notify the webview of the updated profiles
  vscode.window.activeTextEditor?.webview?.postMessage({ command: 'updateProfiles', profiles });

  vscode.window.showInformationMessage(`Profile "${profileName}" added.`);
}

function deleteProfile(profileId) {
  if (profiles[profileId]) {
    delete profiles[profileId];

    // Notify the webview of the updated profiles
    vscode.window.activeTextEditor?.webview?.postMessage({ command: 'updateProfiles', profiles });

    vscode.window.showInformationMessage(`Profile "${profileId}" deleted.`);
  } else {
    vscode.window.showErrorMessage(`Profile "${profileId}" does not exist.`);
  }
}

function createKeybinding(redirectedKey, destinationText, activeProfileParameter) {
  if (redirectedKey && destinationText && activeProfileParameter) {
    const template = `
        {
            "key": "${redirectedKey}", 
            "command": "type",
            "args": {
              "text": "${destinationText}"
            },
            "when": "dynamicKeybindingsEnabled && activeProfile == '${activeProfileParameter}'"
        },`;

    const keybindingsFilePath = path.join(__dirname, 'storageKeybindings.json');

    try {
      let fileContent = fs.readFileSync(keybindingsFilePath, 'utf8');
      const lines = fileContent.split('\n');
      const insertLine = 2;
      lines.splice(insertLine, 0, template);
      fs.writeFileSync(keybindingsFilePath, lines.join('\n'), 'utf8');
      vscode.window.showInformationMessage('Keybinding created successfully!');
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to create keybinding: ${error.message}`);
    }
  } else {
    vscode.window.showErrorMessage('All fields are required to create a keybinding.');
  }
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};
