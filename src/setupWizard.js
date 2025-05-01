const vscode = require('vscode');

function showSetupWizard(context) {
    const panel = vscode.window.createWebviewPanel(
        'setupWizard',
        'Dynamic Keybindings Setup',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    panel.webview.html = getWizardContent();

    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'finishSetup':
                    vscode.window.showInformationMessage('Setup completed! You can now use Dynamic Keybindings.');
                    panel.dispose();
                    break;
            }
        }
    );
}

function getWizardContent() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dynamic Keybindings Setup</title>
        <style>
            body { 
                font-family: var(--vscode-font-family); 
                padding: 20px;
                line-height: 1.6;
            }
            .step { 
                display: none; 
                margin-bottom: 20px;
            }
            .step.active { 
                display: block; 
            }
            .navigation {
                margin-top: 20px;
            }
            button {
                padding: 8px 16px;
                margin-right: 10px;
            }
            .shortcut {
                background: var(--vscode-textBlockQuote-background);
                padding: 2px 6px;
                border-radius: 3px;
            }
            img {
                max-width: 100%;
                margin: 10px 0;
            }
            .example-box-step1 {
                background: var(--vscode-editor-background);
                border: 1px solid var(--vscode-editorWidget-border);
                padding: 10px;
                margin: 10px 0;
                border-radius: 5px;
                max-width: 500px;
            }
            .example-box-step3 {
                background: var(--vscode-editor-background);
                border: 1px solid var(--vscode-editorWidget-border);
                padding: 10px;
                margin: 10px 0;
                border-radius: 5px;
                width: 400px;
            }
        </style>
    </head>
    <body>
        <div class="step active" id="step1">
            <h2>Welcome to Dynamic Keybindings!</h2>
            <p>This wizard will help you get started with the extension.</p>
            <h3>Basic Concepts:</h3>
            <ul>
                <li>Profiles: Sets of custom keybindings, you can switch between</li>
                <li>Key Mappings: Remap single keys to different characters or full texts</li>
                <div class="example-box-step1">
                    <h4>Example:</h4>
                    <p>Pressing <span class="shortcut">h</span> can be remapped to type <span class="shortcut">"Hello, World!"</span>.</p>
                </div>
                
                <li>Command Shortcuts: Create custom keyboard shortcuts for VS Code commands</li>
                <div class="example-box-step1">
                    <h4>Example:</h4>
                    <p>Pressing <span class="shortcut">Ctrl+K</span> can be remapped to execute a VS Code command like <span class="shortcut">Save File</span>.</p>
                </div>
            </ul>
        </div>

        <div class="step" id="step2">
            <h2>Profiles</h2>
            <p>The extension comes with a "Default Profile" (ID=P0) that includes:</p>
            <ul>
                <li>Key Mappings for numbers and some other keys to their corresponding '+shift' equivalent </li>
                <li>Shift + Numbers return the original numbers</li>
            </ul>
            <p>If you dont like it, you can always change it in our interface!</p>

            <h2>Managing Profiles</h2>
            <p>You can:</p>
            <ul>
                <li>Toggle extension: <span class="shortcut">Ctrl+Alt+Z</span></li>
                <li>Switch profiles: <span class="shortcut">Ctrl+Shift+1-9</span></li>
                <li>Create new profiles through the Dynamic Keybindings interface</li>
                <li>Delete profiles you don't need</li>
                <li>Check your profiles keybindings and make sure they have all you need</li>
                <li>Open interface: Command Palette → "Dynamic Keybindings: Open Webview"</li>
            </ul>
            <p>Open the interface with: <span class="shortcut">Ctrl+Shift+P</span> and type "Dynamic Keybindings: Open Webview"</p>
        </div>


        <div class="step" id="step3">
            <h2>Interface Overview</h2>
            <p>The Dynamic Keybindings interface provides all the tools you need:</p>
            <ul>
                <b><li>Create and manage profiles</li></b>
                <div class="example-box-step3">
                    <h4>Example: Managing Profiles</h4>
                    <p>Add a new profile:</p>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span style="background: var(--vscode-input-background); padding: 4px 8px; border: 1px solid var(--vscode-input-border);">Default Profile</span>
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 4px 8px;">Delete</span>
                    </div>
                    <p><em>Your existing profiles will be displayed like this. Clicking <span class="shortcut">Delete</span> will show a confirmation message. If you agree, the profile and all related keybindings will be deleted.</em></p>

                    <br>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span style="background: var(--vscode-input-background); padding: 4px 8px; border: 1px solid var(--vscode-input-border);">Cpp Profile</span>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 4px 8px;">Add Profile</span>    
                    </div>
                    <p><em>To create a new profile, enter the name in the text field and click the button, your new profile will have impact after restart VS Code.</em></p>
                </div>
                <br>
                <b><li>Add key mappings</li></b>
                <div class="example-box-step3">
                    <h4>Creating a Key Mapping</h4>
                    <p>Redirected key:</p>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-input-background); padding: 4px 8px; border: 1px solid var(--vscode-input-border);">h</span>
                    </div>
                    <p><em>Text field to enter a key or key combination to redirect to text.</em></p>

                    <p>Destination text:</p>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-input-background); padding: 4px 8px; border: 1px solid var(--vscode-input-border);">"Hello, World!"</span>    
                    </div>
                    <p><em>Text field to define what will be typed after pressing the keys.</em></p>
                    
                    <p>Active Profile:</p>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 4px 8px;">Default Profile</span>    
                    </div>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 4px 8px;">Create Keybinding</span>    
                    </div>
                    <p><em>Selectable menu to choose in which profile the keybinding will be activated.</em></p>
                </div>

                <br>
                <b><li>Add command shortcuts</li></b>
                <div class="example-box-step3">
                    <h4>Creating a command shortcut:</h4>
                    <p>Shortcut</p>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-input-background); padding: 4px 8px; border: 1px solid var(--vscode-input-border);">ctrl+shift+z</span>
                    </div>
                    <p><em>Text field to enter a key combination to trigger the command action.</em></i></p>
                    
                    <p>Command Action</p>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 4px 8px;">Redo</span>    
                    </div>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-input-background); padding: 4px 8px; border: 1px solid var(--vscode-input-border);">Redo</span>    
                    </div>
                    <p><em>You will be given a selectable menu and a text field to filter VS Code action commands.</em></p>

                    <p>Active Profile:</p>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 4px 8px;">Default Profile</span>    
                    </div>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 4px 8px;">Create Command</span>    
                    </div>
                    <p><em>Selectable menu to choose in which profile the keybinding will be activated.</em></p>
                </div>

                <br>
                <b><li>View and delete existing keybindings</li></b>
                <div class="example-box-step3">
                    <h4>Example: Managing Keybindings</h4>
                    <div style="border: 1px solid var(--vscode-input-border); padding: 8px; margin: 5px 0;">
                        <p style="margin: 0 0 5px 0"><b>Key:</b> h <br> <b>Command:</b> type <br> <b>Text:</b> "Hello, World!"</p>
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 2px 6px; font-size: 12px;">Delete</span>
                        <p><em>This is a more readable example of how your keybindings will be listed, is this case, one key to a whole text</em></p>
                        <br>
                        <p style="margin: 0 0 5px 0"><b>Key:</b> ctrl+j <br> <b>Command:</b> type <br> <b>Text:</b> "console.log()"</p>
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 2px 6px; font-size: 12px;">Delete</span>
                        <p><em>You can also put shortcuts to text</em></p>
                        <br>
                        <p style="margin: 0 0 5px 0"><b>Key:</b> ctrl+shift+z <br> <b>Command:</b> Redo</p>
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 2px 6px; font-size: 12px;">Delete</span>
                        <p><em>If the keybinding is a command shortcut, it will just show you the shortcut and the command action</em></p>
                    </div>
                </div>
            </ul>
        </div>

        <div class="step" id="step4">
            <h2>Ready to Start!</h2>
            <p>You're all set to use Dynamic Keybindings, but first I will give you some tips to make the most of the app:</p>
            <ul>
                <li>New profiles or keybindings will have impact after restarting VS Code.</li>
                <li>Use the refresh button if you don't see your changes immediately.</li>
                <li>You can also use key mapping to introduce long text through a command, for example <span class="shortcut">ctrl+shift+alt+c</span> to write "#include iostream \\n using namespace std; \\n\\n int main() {\\n\\n}", the usual C++ start</li>
                <li>If you set an already existant native shortcut of VS Code it will execute the latest one, that means, if you have your profile active, it will execute your command, if the profile is not active, it will execute the native VSC command</li>
            </ul>
            <p>Check the README.md file for detailed documentation.</p>
        </div>

        <div class="navigation">
            <button id="prevBtn" style="display: none;">Previous</button>
            <button id="nextBtn">Next</button>
        </div>

        <script>
            const vscode = acquireVsCodeApi();
            const steps = document.querySelectorAll('.step');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            let currentStep = 0;

            function updateButtons() {
                prevBtn.style.display = currentStep === 0 ? 'none' : 'inline';
                nextBtn.textContent = currentStep === steps.length - 1 ? 'Finish' : 'Next';
            }

            function showStep(step) {
                steps.forEach((s, i) => {
                    s.classList.toggle('active', i === step);
                });
                currentStep = step;
                updateButtons();
            }

            prevBtn.addEventListener('click', () => {
                if (currentStep > 0) showStep(currentStep - 1);
            });

            nextBtn.addEventListener('click', () => {
                if (currentStep < steps.length - 1) {
                    showStep(currentStep + 1);
                } else {
                    vscode.postMessage({ command: 'finishSetup' });
                }
            });
        </script>
    </body>
    </html>`;
}

module.exports = { showSetupWizard };
