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
        </style>
    </head>
    <body>
        <div class="step active" id="step1">
            <h2>Welcome to Dynamic Keybindings!</h2>
            <p>This wizard will help you get started with the extension.</p>
            <h3>Basic Concepts:</h3>
            <ul>
                <li>Profiles: Sets of custom keybindings you can switch between</li>
                <li>Key Mappings: Remap single keys to different characters or full texts</li>
                <div class="example-box">
                    <h4>Example:</h4>
                    <p>Pressing <span class="shortcut">h</span> can be remapped to type <span class="shortcut">"Hello, World!"</span>.</p>
                </div>
                <style>
                    .example-box {
                        background: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-editorWidget-border);
                        padding: 10px;
                        margin-top: 10px;
                        border-radius: 5px;
                    }
                    .example-box h4 {
                        margin: 0 0 5px 0;
                    }
                </style>
                <li>Command Shortcuts: Create custom keyboard shortcuts for VS Code commands</li>
                <div class="example-box">
                    <h4>Example:</h4>
                    <p>Pressing <span class="shortcut">Ctrl+K</span> can be remapped to execute a VS Code command like <span class="shortcut">Save File</span>.</p>
                </div>
                <style>
                    .example-box {
                        background: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-editorWidget-border);
                        padding: 10px;
                        margin-top: 10px;
                        border-radius: 5px;
                    }
                    .example-box h4 {
                        margin: 0 0 5px 0;
                    }
                </style>
            </ul>
        </div>

        <div class="step" id="step2">
            <h2>Profiles</h2>
            <p>The extension comes with a "Default Profile" (P0) that includes:</p>
            <ul>
                <li>Key Mappings for numbers and some other keys to their corresponding '+shift' equivalent </li>
                <li>Shift + Numbers return the original numbers</li>
            </ul>
            <p>If you dont like it, you can always change it in our interface!</p>

            <h2>Managing Profiles</h2>
            <p>You can:</p>
            <ul>
                <li>Switch profiles: <span class="shortcut">Ctrl+Shift+1-9</span></li>
                <li>Create new profiles through the Dynamic Keybindings interface</li>
                <li>Delete profiles you don't need</li>
                <li>Check your profiles keybindings and make sure they have all you need</li>
            </ul>
            <p>Open the interface with: <span class="shortcut">Ctrl+Shift+P</span> and type "Dynamic Keybindings: Open Webview"</p>
        </div>

        <div class="step" id="step3">
            <h2>Interface Overview</h2>
            <p>The Dynamic Keybindings interface provides all the tools you need:</p>
            <ul>
                <li>Create and manage profiles</li>
                <div class="example-box">
                    <h4>Example: Managing Profiles</h4>
                    <p>Add a new profile:</p>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span style="background: var(--vscode-input-background); padding: 4px 8px; border: 1px solid var(--vscode-input-border);">Default Profile</span>
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 4px 8px;">Delete</span>
                        <br>
                        <span style="background: var(--vscode-input-background); padding: 4px 8px; border: 1px solid var(--vscode-input-border);">Cpp Profile</span>
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 4px 8px;">Add Profile</span>
                    </div>
                </div>
                <li>Add key mappings</li>
                <div class="example-box">
                    <h4>Creating a Key Mapping</h4>
                    <p>Redirected key:</p>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-input-background); padding: 4px 8px; border: 1px solid var(--vscode-input-border);">h</span>
                    <p>Destination text:</p>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-input-background); padding: 4px 8px; border: 1px solid var(--vscode-input-border);">"Hello, World!"</span>    
                    </div>
                    <p>Active Profile:</p>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 4px 8px;">Default Profile</span>    
                    </div><div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 4px 8px;">Create Keybinding</span>    
                    </div>
                </div>
                <li>Add command shortcuts</li>
                <div class="example-box">
                    <h4>Creating a command shortcut:</h4>
                    <p>Shortcut</p>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-input-background); padding: 4px 8px; border: 1px solid var(--vscode-input-border);">ctrl+shift+z</span>
                    <p>Command Action</p>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 4px 8px;">Redo</span>    
                    </div>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-input-background); padding: 4px 8px; border: 1px solid var(--vscode-input-border);">Redo</span>    
                    </div>
                    <p>Active Profile:</p>
                    <div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 4px 8px;">Default Profile</span>    
                    </div>
                    </div><div style="margin-bottom: 8px;">
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 4px 8px;">Create Command</span>    
                    </div>
                </div>
                <li>View and delete existing keybindings</li>
                <div class="example-box">
                    <h4>Example: Managing Keybindings</h4>
                    <div style="border: 1px solid var(--vscode-input-border); padding: 8px; margin: 5px 0;">
                        <p style="margin: 0 0 5px 0">Key: ctrl+j | Command: type | Text: "console.log()"</p>
                        <span style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); padding: 2px 6px; font-size: 12px;">Delete</span>
                    </div>
                </div>
            </ul>
            <p>Note: New profiles or keybindings will have impact after restarting VS Code</p>
            <p>Tip: Use the refresh button if you don't see your changes immediately.</p>
        </div>

        <div class="step" id="step4">
            <h2>Ready to Start!</h2>
            <p>You're all set to use Dynamic Keybindings. Remember:</p>
            <ul>
                <li>Toggle extension: <span class="shortcut">Ctrl+Alt+Z</span></li>
                <li>Switch profiles: <span class="shortcut">Ctrl+Shift+1-9</span></li>
                <li>Open interface: Command Palette → "Dynamic Keybindings: Open Webview"</li>
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
