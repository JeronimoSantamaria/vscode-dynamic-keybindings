# Change Log

All notable changes to Dynamic Keybindings will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
