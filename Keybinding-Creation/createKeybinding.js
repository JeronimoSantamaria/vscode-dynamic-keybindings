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
            case 'getProfileKeybindings':
              const keybindings = getProfileKeybindings(message.profileId);
              panel.webview.postMessage({ command: 'displayKeybindings', keybindings });
              return;
            case 'deleteKeybinding':
              deleteKeybinding(message, context);
              return;
            case 'reloadWebview':
              vscode.commands.executeCommand('dynamic-keybindings.openWebview');
              return;
            case 'getNativeKeybindings':
              const nativeKeybindings = getNativeKeybindings();
              panel.webview.postMessage({ command: 'displayNativeKeybindings', keybindings: nativeKeybindings });
              return;
            case 'addSpecialShortcut':
              addSpecialShortcut(message);
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
      <meta name="viewport" width="device-width, initial-scale=1.0">
      <title>Dynamic Keybindings</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; }
        input, select { display: block; margin-bottom: 10px; width: 100%; padding: 8px; max-width: 220px;}
        button { padding: 10px 20px; margin-right: 10px; width: 160px; }
        button.delete-profile { width: auto; padding: 5px 10px; margin: 0; }
        .refresh-button { width: auto; }
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
        .sticky-header {
          position: sticky;
          top: 0;
          padding: 10px 0;
          z-index: 100;
          display: flex;
          justify-content: flex-end;
        }
        .refresh-button {
          background: #007acc;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin: 10px 0;
          position: fixed;
          top: 10px;
          right: 20px;
          z-index: 1000;
        }
        .refresh-button:hover {
          background: #005999;
        }
        .main-content {
          margin-top: 60px;
        }
      </style>
    </head>
    <body>
      <div class="sticky-header">
        <button class="refresh-button" id="refreshTop">Refresh View</button>
      </div>
      <div class="main-content">
        <h1>Dynamic Keybindings</h1>
        <p>Manage your profiles and create custom keybindings.</p>
        
        <h2>Profiles</h2>
        <ul id="profileList"></ul>
        <input type="text" id="newProfileName" placeholder="New Profile Name">
        <button id="addProfileButton">Add Profile</button>

        <div id="adMessage">
          <p><strong>Warning:</strong> You have reach the maximum (9) of predefine activate profiles commands, if you add one more, you will have to define it manually in package.json</p>
        </div>

        <h2>Create Key Mapping</h2>
        <form id="keybindingForm">
          <label for="redirectedKey">Redirected Key:</label>
          <input type="text" id="redirectedKey" name="redirectedKey" required> 
          <label for="destinationText">Destination Text:</label>
          <input type="text" id="destinationText" name="destinationText" required>
          <label for="activeProfileParameter">Active Profile:</label>
          <select id="activeProfileParameter" name="activeProfileParameter"></select>
          <button type="submit">Create Keybinding</button>
        </form>

        <h2>Create Command Shortcut</h2>
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

        <h2>View Profile Keybindings</h2>
        <div>
          <select id="viewProfileSelect"></select>
          <button id="printKeybindings">Print Keybindings</button>
        </div>
        <div id="keybindingsList"></div>

        <h2>Native Keybindings</h2>
        <div>
          <button id="printNativeKeybindings">View Native Keybindings</button>
          <div id="nativeKeybindingsList"></div>
        </div>

        <h2>Add Special Shortcuts</h2>
        <form id="specialShortcutForm">
          <label for="shortcutType">Command Type:</label>
          <select id="shortcutType" required>
            <option value="toggle">Toggle Dynamic Keybindings</option>
            <option value="profile">Activate Profile</option>
          </select>
          <div id="profileSelection" style="display: none;">
            <label for="profileId">Profile:</label>
            <select id="profileId"></select>
          </div>
          <label for="shortcutKey">Key Combination:</label>
          <input type="text" id="shortcutKey" required>
          <p class="example-text">Example: ctrl+shift+p</p>
          <button type="submit">Add Shortcut</button>
        </form>
      </div>

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
          } else if (message.command === 'displayKeybindings') {
            const keybindingsList = document.getElementById('keybindingsList');
            keybindingsList.innerHTML = '';
            
            message.keybindings.forEach((kb, index) => {
              const div = document.createElement('div');
              div.style.margin = '10px 0';
              div.style.padding = '10px';
              div.style.border = '1px solid #ccc';
              
              const details = document.createElement('p');
              details.textContent = 'Key: ' + kb.key + ' | Command: ' + kb.command;
              if (kb.args) {
                details.textContent += ' | Text: ' + kb.args.text;
              }
              
              const deleteButton = document.createElement('button');
              deleteButton.textContent = 'Delete';
              deleteButton.onclick = () => {
                vscode.postMessage({ 
                  command: 'deleteKeybinding', 
                  key: kb.key,
                  profileCondition: kb.when
                });
              };
              
              div.appendChild(details);
              div.appendChild(deleteButton);
              keybindingsList.appendChild(div);
            });
          } else if (message.command === 'displayNativeKeybindings') {
            const nativeList = document.getElementById('nativeKeybindingsList');
            nativeList.innerHTML = '';
            
            message.keybindings.forEach(kb => {
              const div = document.createElement('div');
              div.style.margin = '10px 0';
              div.style.padding = '10px';
              div.style.border = '1px solid #ccc';
              div.style.display = 'flex';
              div.style.justifyContent = 'space-between';
              div.style.alignItems = 'center';
              
              const details = document.createElement('span');
              details.textContent = \`Key: \${kb.key} | Command: \${kb.command}\`;
              
              const deleteButton = document.createElement('button');
              deleteButton.textContent = 'Delete';
              deleteButton.onclick = () => {
                vscode.postMessage({ 
                  command: 'deleteKeybinding',
                  key: kb.key,
                  profileCondition: undefined // undefined for native keybindings
                });
              };
              
              div.appendChild(details);
              div.appendChild(deleteButton);
              nativeList.appendChild(div);
            });
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
          adMessage.style.display = Object.keys(profiles).length >= 9 ? 'block' : 'none';
          
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

          // Update view profile selector
          const viewProfileSelect = document.getElementById('viewProfileSelect');
          viewProfileSelect.innerHTML = '';
          for (const [id, name] of Object.entries(profiles)) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = name;
            viewProfileSelect.appendChild(option);
          }

          // Update profile selection for special shortcuts
          const profileSelection = document.getElementById('profileId');
          profileSelection.innerHTML = '';
          for (const [id, name] of Object.entries(profiles)) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = name;
            profileSelection.appendChild(option);
          }
        }

        document.getElementById('printKeybindings').addEventListener('click', () => {
          const profileId = document.getElementById('viewProfileSelect').value;
          vscode.postMessage({ command: 'getProfileKeybindings', profileId });
        });

        // Add refresh functionality
        function refreshWebview() {
          vscode.postMessage({ command: 'reloadWebview' });
        }

        document.getElementById('refreshTop').addEventListener('click', refreshWebview);

        // Add handlers for native keybindings
        document.getElementById('printNativeKeybindings').addEventListener('click', () => {
          vscode.postMessage({ command: 'getNativeKeybindings' });
        });

        document.getElementById('shortcutType').addEventListener('change', (e) => {
          const profileSelection = document.getElementById('profileSelection');
          profileSelection.style.display = e.target.value === 'profile' ? 'block' : 'none';
        });

        document.getElementById('specialShortcutForm').addEventListener('submit', (e) => {
          e.preventDefault();
          const type = document.getElementById('shortcutType').value;
          const key = document.getElementById('shortcutKey').value;
          const profileId = document.getElementById('profileId').value;
          
          vscode.postMessage({
            command: 'addSpecialShortcut',
            shortcutType: type,
            key: key,
            profileId: type === 'profile' ? profileId : undefined
          });
        });
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

async function deleteProfile(profileId, context) {
  if (!profiles[profileId]) {
    vscode.window.showErrorMessage(`Profile "${profileId}" does not exist.`);
    return;
  }

  const profileName = profiles[profileId];
  const confirmed = await vscode.window.showWarningMessage(
    `Are you sure you want to delete "${profileName}"? This action cannot be undone and it will delete all related keybindings to this profile.`,
    'Yes', 'No'
  );

  if (confirmed !== 'Yes') {
    return;
  }

  // Delete related keybindings
  const keybindingsFilePath = path.join(__dirname, '../package.json');
  try {
    let fileContent = fs.readFileSync(keybindingsFilePath, 'utf8');
    const packageJson = JSON.parse(fileContent);
    const keybindings = packageJson.contributes.keybindings;

    // Filter out keybindings related to this profile
    packageJson.contributes.keybindings = keybindings.filter(kb =>
      !kb.when || !kb.when.includes(`activeProfile == '${profileId}'`)
    );

    // Save the updated keybindings
    fs.writeFileSync(keybindingsFilePath, JSON.stringify(packageJson, null, 2), 'utf8');

    // Delete the profile
    delete profiles[profileId];
    saveProfiles(context);

    vscode.window.activeTextEditor?.webview?.postMessage({ command: 'updateProfiles', profiles });
    vscode.window.showInformationMessage(`Profile "${profileName}" and its keybindings were deleted successfully.`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to delete profile: ${error.message}`);
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

function deleteKeybinding(message, context) {
  const keybindingsFilePath = path.join(__dirname, '../package.json');

  try {
    let fileContent = fs.readFileSync(keybindingsFilePath, 'utf8');
    const packageJson = JSON.parse(fileContent);
    const keybindings = packageJson.contributes.keybindings;

    // Find the index of the keybinding to delete
    const index = keybindings.findIndex(kb =>
      kb.key === message.key &&
      (message.profileCondition === undefined ? !kb.when : kb.when === message.profileCondition)
    );

    if (index === -1) {
      vscode.window.showErrorMessage('Keybinding not found');
      return false;
    }

    // Remove the keybinding at the found index
    keybindings.splice(index, 1);

    // Update package.json
    packageJson.contributes.keybindings = keybindings;
    fs.writeFileSync(keybindingsFilePath, JSON.stringify(packageJson, null, 2), 'utf8');

    vscode.window.showInformationMessage('Keybinding deleted successfully!');
    return true;
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to delete keybinding: ${error.message}`);
    return false;
  }
}

function getProfileKeybindings(profileId) {
  const keybindingsFilePath = path.join(__dirname, '../package.json');
  try {
    const fileContent = fs.readFileSync(keybindingsFilePath, 'utf8');
    const packageJson = JSON.parse(fileContent);
    return packageJson.contributes.keybindings.filter(kb =>
      kb.when && kb.when.includes(`activeProfile == '${profileId}'`)
    );
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to read keybindings: ${error.message}`);
    return [];
  }
}

function getNativeKeybindings() {
  const keybindingsFilePath = path.join(__dirname, '../package.json');
  try {
    const fileContent = fs.readFileSync(keybindingsFilePath, 'utf8');
    const packageJson = JSON.parse(fileContent);
    return packageJson.contributes.keybindings.filter(kb => !kb.when);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to read native keybindings: ${error.message}`);
    return [];
  }
}

async function addSpecialShortcut(message) {
  const keybindingsFilePath = path.join(__dirname, '../package.json');
  try {
    let fileContent = fs.readFileSync(keybindingsFilePath, 'utf8');
    const packageJson = JSON.parse(fileContent);

    const newKeybinding = {
      key: message.key,
      command: message.shortcutType === 'toggle'
        ? 'dynamic-keybindings.toggle'
        : `dynamic-keybindings.${message.profileId}`
    };

    packageJson.contributes.keybindings.push(newKeybinding);
    fs.writeFileSync(keybindingsFilePath, JSON.stringify(packageJson, null, 2), 'utf8');
    vscode.window.showInformationMessage('Special shortcut added successfully!');
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to add special shortcut: ${error.message}`);
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
