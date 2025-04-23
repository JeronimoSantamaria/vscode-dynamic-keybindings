const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

let profiles = { P0: 'Default Profile' }; // Dictionary to store profiles

function activate(context) {
  loadProfiles(context);

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

      // Get all available commands
      const commands = await vscode.commands.getCommands(true);
      const sortedCommands = commands.sort();

      panel.webview.html = getWebviewContent();

      // Send initial data to the webview
      panel.webview.postMessage({
        command: 'initializeData',
        profiles,
        commands: sortedCommands
      });

      panel.webview.onDidReceiveMessage(
        message => {
          switch (message.command) {
            case 'createKeybinding':
              createKeybinding(message.redirectedKey, message.destinationText, message.activeProfileParameter);
              return;
            case 'createCommand':
              createCommand(message.commandKey, message.commandAction, message.activeProfileParameter);
              return;
            case 'addProfile':
              addProfile(message.profileName, context);
              return;
            case 'deleteProfile':
              deleteProfile(message.profileId, context);
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
        input, select { display: block; margin-bottom: 10px; width: 100%; padding: 8px; max-width: 220px;}
        button { padding: 10px 20px; margin-right: 10px; }
        #profileList { max-width: 220px; padding: 0; }
        #profileList li { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .delete-profile { padding: 5px 10px; margin: 0; }
        #adMessage { 
          display: none; 
          background: #fff3cd; 
          color: #664d03; 
          padding: 15px; 
          margin: 10px 0; 
          border: 1px solid #ffecb5; 
          border-radius: 4px; 
          font-size: 14px;
        }
        .example-text { font-size: 12px; color: #666; margin-top: -8px; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <h1>Dynamic Keybindings</h1>
      <p>Manage your profiles and create custom keybindings.</p>
      
      <h2>Profiles</h2>
      <ul id="profileList"></ul>
      <input type="text" id="newProfileName" placeholder="New Profile Name">
      <button id="addProfileButton">Add Profile</button>

      <div id="adMessage">
        <p><strong>Warning:</strong> You have reach the maximum (9) of predefine activate profiles commands, if you add one more, you will have to define it manually in package.json</p>
      </div>

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

      <h2>Create Command</h2>
      <form id="commandForm">
        <label for="commandKey">Key:</label>
        <input type="text" id="commandKey" name="commandKey" required>
        <p class="example-text">Example: ctrl+alt+shift+a</p>
        <label for="commandAction">Command Action:</label>
        <select id="commandAction" name="commandAction" required>
          <option value="">Select a command...</option>
        </select>
        <input type="text" id="commandFilter" placeholder="Filter commands...">
        <p class="example-text">Example: workbench.action.showCommands</p>
        <label for="commandProfileParameter">Active Profile:</label>
        <select id="commandProfileParameter" name="commandProfileParameter"></select>
        <button type="submit">Create Command</button>
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

        // Handle creating a command
        document.getElementById('commandForm').addEventListener('submit', (event) => {
          event.preventDefault();
          const commandKey = document.getElementById('commandKey').value;
          const commandAction = document.getElementById('commandAction').value;
          const activeProfileParameter = document.getElementById('commandProfileParameter').value;
          vscode.postMessage({
            command: 'createCommand',
            commandKey,
            commandAction,
            activeProfileParameter
          });

          document.getElementById('commandForm').reset();
        });

        // Handle command filtering and selection
        const commandSelect = document.getElementById('commandAction');
        const commandFilter = document.getElementById('commandFilter');
        let allCommands = [];

        window.addEventListener('message', (event) => {
          const message = event.data;
          if (message.command === 'initializeData') {
            const profiles = message.profiles;
            allCommands = message.commands;
            
            // Populate commands
            populateCommands(allCommands);
            
            // Update profiles
            updateProfiles(profiles);
          }
        });

        function populateCommands(commands) {
          commandSelect.innerHTML = '<option value="">Select a command...</option>';
          commands.forEach(cmd => {
            const option = document.createElement('option');
            option.value = cmd;
            option.textContent = cmd;
            commandSelect.appendChild(option);
          });
        }

        commandFilter.addEventListener('input', (e) => {
          const filterText = e.target.value.toLowerCase();
          const filteredCommands = allCommands.filter(cmd => 
            cmd.toLowerCase().includes(filterText)
          );
          populateCommands(filteredCommands);
        });

        function updateProfiles(profiles) {
          profileList.innerHTML = '';
          activeProfileSelect.innerHTML = '';
          const commandProfileSelect = document.getElementById('commandProfileParameter');
          commandProfileSelect.innerHTML = '';
          
          // Show/hide ad message based on profiles count
          const adMessage = document.getElementById('adMessage');
          adMessage.style.display = Object.keys(profiles).length >= 8 ? 'block' : 'none';
          
          for (const [id, name] of Object.entries(profiles)) {
            const li = document.createElement('li');
            li.textContent = \`\${name} (\${id})\`;
            li.innerHTML += \` <button class="delete-profile" data-profile-id="\${id}">Delete</button>\`;
            profileList.appendChild(li);

            // Add option to keybinding select
            const option1 = document.createElement('option');
            option1.value = id;
            option1.textContent = name;
            activeProfileSelect.appendChild(option1);

            // Add option to command select
            const option2 = document.createElement('option');
            option2.value = id;
            option2.textContent = name;
            commandProfileSelect.appendChild(option2);
          }
        }
      </script>
    </body>
    </html>
  `;
}

function loadProfiles(context) {
  profiles = context.globalState.get('profiles', { P0: 'Default Profile' });
  return profiles;
}

function saveProfiles(context) {
  context.globalState.update('profiles', profiles);
}

function addProfile(profileName, context) {
  const profileId = `P${Object.keys(profiles).length}`;
  profiles[profileId] = profileName;
  saveProfiles(context);

  // Register the command for the new profile
  const extension = vscode.extensions.getExtension('dynamic-keybindings');
  if (extension) {
    const extensionExports = extension.exports;
    if (extensionExports && typeof extensionExports.registerProfileCommand === 'function') {
      extensionExports.registerProfileCommand(context, profileId, profileName);
    }
  }

  vscode.window.activeTextEditor?.webview?.postMessage({ command: 'updateProfiles', profiles });
  vscode.window.showInformationMessage(`Profile "${profileName}" added. Use Command Palette to access it.`);
}

function deleteProfile(profileId, context) {
  if (profiles[profileId]) {
    delete profiles[profileId];
    saveProfiles(context);

    vscode.window.activeTextEditor?.webview?.postMessage({ command: 'updateProfiles', profiles });
    vscode.window.showInformationMessage(`Profile "${profileId}" deleted.`);
  } else {
    vscode.window.showErrorMessage(`Profile "${profileId}" does not exist.`);
  }
}

async function createKeybinding(redirectedKey, destinationText, activeProfileParameter) {
  if (redirectedKey && destinationText && activeProfileParameter) {
    const keybindingsFilePath = path.join(__dirname, '../package.json');

    try {
      let fileContent = fs.readFileSync(keybindingsFilePath, 'utf8');
      const packageJson = JSON.parse(fileContent);
      const keybindings = packageJson.contributes.keybindings;

      // Check for duplicate key binding with same profile
      const duplicateKey = keybindings.find(kb =>
        kb.key === redirectedKey &&
        kb.when &&
        kb.when.includes(`activeProfile == '${activeProfileParameter}'`)
      );

      if (duplicateKey) {
        vscode.window.showErrorMessage(`A keybinding with key "${redirectedKey}" already exists for profile "${activeProfileParameter}"`);
        return;
      }

      const template = `
      {
        "key": "${redirectedKey}", 
        "command": "type",
        "args": {
          "text": "${destinationText}"
        },
        "when": "dynamicKeybindingsEnabled && activeProfile == '${activeProfileParameter}'"
      }`;

      const lines = fileContent.split('\n');
      const insertLine = -5;
      lines.splice(insertLine, 0, ',' + template);
      fs.writeFileSync(keybindingsFilePath, lines.join('\n'), 'utf8');

      vscode.commands.executeCommand('workbench.action.files.save').then(() => {
        vscode.window.showInformationMessage('Keybinding created and saved successfully!');
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to create keybinding: ${error.message}`);
    }
  } else {
    vscode.window.showErrorMessage('All fields are required to create a keybinding.');
  }
}

async function createCommand(commandKey, commandAction, activeProfileParameter) {
  if (commandKey && commandAction && activeProfileParameter) {
    const keybindingsFilePath = path.join(__dirname, '../package.json');

    try {
      let fileContent = fs.readFileSync(keybindingsFilePath, 'utf8');
      const packageJson = JSON.parse(fileContent);
      const keybindings = packageJson.contributes.keybindings;

      // Check for duplicate key binding with same profile
      const duplicateKey = keybindings.find(kb =>
        kb.key === commandKey &&
        kb.when &&
        kb.when.includes(`activeProfile == '${activeProfileParameter}'`)
      );

      if (duplicateKey) {
        vscode.window.showErrorMessage(`A command with key "${commandKey}" already exists for profile "${activeProfileParameter}"`);
        return;
      }

      // Check if action is already triggered by another command in same profile
      const duplicateAction = keybindings.find(kb =>
        kb.command === commandAction &&
        kb.when &&
        kb.when.includes(`activeProfile == '${activeProfileParameter}'`)
      );

      if (duplicateAction) {
        const result = await vscode.window.showWarningMessage(
          `The command "${commandAction}" is already triggered by key "${duplicateAction.key}" in this profile. Do you want to create it anyway?`,
          'Yes', 'No'
        );
        if (result !== 'Yes') return;
      }

      const template = `
      {
        "key": "${commandKey}",
        "command": "${commandAction}",
        "when": "dynamicKeybindingsEnabled && activeProfile == '${activeProfileParameter}'"
      }`;

      const lines = fileContent.split('\n');
      const insertLine = -5;
      lines.splice(insertLine, 0, ',' + template);
      fs.writeFileSync(keybindingsFilePath, lines.join('\n'), 'utf8');

      vscode.commands.executeCommand('workbench.action.files.save').then(() => {
        vscode.window.showInformationMessage('Command created and saved successfully!');
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to create command: ${error.message}`);
    }
  } else {
    vscode.window.showErrorMessage('All fields are required to create a command.');
  }
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
  loadProfiles,
  profiles,
  addProfile,
  deleteProfile,
  registerProfileCommand: (context, profileId, profileName) => {
    const extension = vscode.extensions.getExtension('dynamic-keybindings');
    if (extension && extension.exports && typeof extension.exports.registerProfileCommand === 'function') {
      extension.exports.registerProfileCommand(context, profileId, profileName);
    }
  }
};
