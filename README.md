# Dynamic Keybindings

Dynamic Keybindings is a Visual Studio Code extension that empowers developers to create and manage dynamic keyboard shortcut profiles. It allows users to define custom sets of keybindings and toggle these profiles on and off through simple commands, adapting their coding environment to meet diverse workflow needs.

## Features
- **Create Multiple Profiles:** 
    - Define various keybinding sets tailored to different projects or coding tasks through an intuitive user interface.
- **Dynamic Key Mapping:** 
  - Remap single keys to different characters or text snippets
  - Create custom command shortcuts within each profile
  - Real-time key mapping with minimal delay
- **Profile Management:**
  - Seamlessly switch between profiles using keyboard shortcuts (Ctrl+Shift+1-9)
  - Toggle all dynamic keybindings on/off with a single command (Ctrl+Alt+Z)
  - Create, modify, and delete profiles through a user-friendly interface
- **User Interface:**
  - Easy-to-use WebView interface for managing profiles and keybindings
  - Visual feedback through the VS Code status bar showing current profile and state
  - Searchable command list when creating new command shortcuts
- **Default Profile:** Comes with a pre-configured default profile optimized for programming tasks

## Installation (Not Released yet)
- Install the extension from the VS Code marketplace
- Access the Dynamic Keybindings interface through the command palette
- Start creating your custom keybinding profiles

## Usage

### Managing Profiles
1. "Open Dynamic Keybindings Webview" in the command palette
2. Create new profiles using the "Add Profile" button
3. Switch between profiles using Ctrl+Shift+1-9 or through commands
4. Toggle all keybindings on/off using Ctrl+Alt+Z

### Creating Keybindings
1. Open the Dynamic Keybindings interface
2. Choose between creating a key mapping or a command shortcut
3. For key mapping:
   - Enter the key to be remapped
   - Specify the destination text
   - Select the profile
4. For command shortcuts:
   - Enter the key combination
   - Select a VS Code command from the searchable list
   - Choose the target profile

### Viewing Keybindings
- Use the "Print Keybindings" feature to view all keybindings in a profile
- Delete individual keybindings directly from the view

## Default Profile
The extension comes with a default profile (P0) that includes common programming-related key mappings to improve typing efficiency:
- Numbers (1-9) remapped to common programming symbols
- Shift+Numbers return the original numbers
- Additional command shortcuts for common VS Code actions

## License
This project is licensed under the GNU General Public License v3.0 with additional terms. See the [LICENSE](LICENSE.md) file for details.

## Contributing
Contributions are welcome! Please feel free to submit issues and pull requests.

## Support
For questions, issues, or feature requests, please create an issue in the GitHub repository or contact jeronimo.s.santamaria@gmail.com
