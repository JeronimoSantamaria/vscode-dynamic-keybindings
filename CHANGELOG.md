# Change Log

All notable changes to Dynamic Keybindings will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.11.2] - 2025-05-12
### Changed 
- Removed the maximum limit warning for pre-set profile commands as users now have direct control over keybinding management
### Fixed
- Refresh the webview now closes the active editor and not just create a new window

## [0.11.1] - 2025-05-12
### Added
- View Extension Keybindings section to the setup wizard
### Fixed
- Multiple format and typing errors

## [0.11.0] - 2025-05-08
### Changed
- Reorganized webview interface with collapsible menus for improved user experience
- Integrated h1 element into header section for better visual hierarchy
- Repurposed h1 element as refresh button to enhance functionality

## [0.10.1] - 2025-05-08
### Added
- Error handling to avoid users to create multiple shortcuts for the same command action

## [0.10.1] - 2025-05-06
### Changed
- Profile Keybindings and native commands are now displayed with new lines instead of pipelines as separators

## [0.10.0] - 2025-05-06
### Added
- Added support for configuring native extension commands through the webview interface

## [0.9.2] - 2025-05-01
### Added
- Useful tips on the final page to improve typing efficiency even more
### Changed
- Now the explanatory texts will be under each section instead of outside the example box due to CPU charge and better readability

## [0.9.1] - 2025-05-01
### Added
- Explainatory texts after the example boxes for users to be clear about every function

## [0.9.0] - 2025-04-30
### Added
- Setup wizard for new users
- Command to show setup wizard at any time
### Changed
- Principal webview font to "Cascadia Code", on process to search a good font pre-instaled in all systems
### Fixed
- Resolved an issue where the maximum pre-defined commands warning was triggered prematurely.

## [0.8.2] - 2025-04-26
### Added
- Now deleteProfile also deletes all the keybindings related to the target profile
- Confirmation messages before deleting a profile

## [0.8.1] - 2025-04-24
### Fixed
- Delete buttons on the list of keybinding erase the first on the command list instead of the selected one

## [0.8.0] - 2025-04-24
### Added
- Print Keybindings button
- Delete keybinding function via button in each printed keybinding
- Refresh page button
### Changed
- Updated README.md to match the actual state of the app

## [0.7.1] - 2025-04-23
### Added
- Added a searchable dropdown list of VS Code commands when creating new commands
- Real-time filtering of commands to improve command selection experience

## [0.7.0] - 2025-04-16
### Added
- Support for dynamic commands with system actions (not the same as key mapping)
- Create command function integrated with the WebView
- Error handling to avoid duplicated redirected keys or commands in one profile

## [0.6.3] - 2025-04-16
### Added
- First draft of default profile
### Modified
- On/Off command 

## [0.6.2] - 2025-04-07
### Modified
- createKeybinding Function now inserts the keybinding directly to package.json, ready to be used

## [0.6.1] - 2025-04-07
### Added
- Added an informational message to the webview when the profiles dictionary overrides the preset commands for switching between commands. This serves as a preventive measure until a more scalable solution is implemented.

## [0.6.0] - 2025-04-07
### Added
- The user can now add new profiles through the Webview interface

### Changed
- Now the profiles are storage in the VS code Global State
- Logic of active profile
- Profile 1 and 2 for a Default and some extras for testing 

## [0.5.2] - 2025-04-01
### Changed
- Created keybindings are now inserted in a specific line instead of appended

### Fixed
- The webview form now restarts after creating a new keybinding

## [0.5.1] - 2025-03-24
### Changed
- Max length of text fields in webview
### Fixed
- Error of misstracked command

## [0.5.0] - 2025-03-24
### Changed
- Integration with native VS code UI to VS code Webview due to API limitations

## [0.4.0] - 2025-03-23
### Added
- Basic interactions inside the native VS Code UI 
- Possibillity to create keybindings without interacting with the code

## [0.3.1] - 2025-03-20
### Added
- Added extension status display to the Visual Studio Code status bar.

## [0.3.0] - 2025-03-20
### Added
- Introduced the first version of multiple profile support.

## [0.2.0] - 2025-03-17
### Added
- Implemented a basic toggle action with a key shortcut.

### Changed
- Added a shortcut for the "dynamic-keybindings.toggle" action.

### Fixed
- Resolved the failure in the activation command.

## [0.1.1] - 2025-03-15
### Added
- Successfully implemented the basic keybindings.
