# Contributing Guide

Thank you for your interest in contributing to this project!  
This is an open source project, and we truly appreciate your ideas, improvements, and suggestions.  
Please follow these guidelines to help us review and merge your contributions smoothly.

<br>

## 📦 Workflow

1️⃣ **Fork this repository**  
Click the **Fork** button at the top to create a personal copy under your GitHub account.

2️⃣ **Create a new branch in your fork**  
For example, `feature/new-functionality` or `fix/bug-fix`.

3️⃣ **Make your changes on that branch**  
- Add code comments where necessary.  
- Keep the code structure clear and consistent with the rest of the project.  
- Avoid including unnecessary files (temporary files, logs, etc.).

4️⃣ **Running & Debugging**
- Set this launch.json in your .vscode folder:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Extension",
            "type": "extensionHost",
            "request": "launch",
            "args": [
                "--extensionDevelopmentPath=${workspaceFolder}"
            ]
        }
    ]
}
```
- Press F5 in VS Code to launch the extension in debug mode
- Check that your improvements work

5️⃣ **Open a Pull Request (PR)**  
Submit your PR **against the `contributions` branch**, not `main`.  
In the PR title and description, please clearly explain:
- What problem it solves or what improvement it adds.
- Any relevant technical details.

<br>

## 📊 Git Commit Guidelines

Format: `type(scope): description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Example: `feat(keybindings): add support for macro recording`

<br>

## ✅ What we do when reviewing your PR

- We manually review all changes (there is no automatic merge).
- We check:
    - That the code is clean, readable, and consistent.
    - That there’s no obfuscated, malicious, or unnecessary code.
    - That the changes don’t break other parts of the project.
- If we find anything to adjust, we’ll leave comments in the PR for you.

<br>

## 🚀 What happens after

- If the contribution is approved, it will be merged into the `contributions` branch.
- We will test the changes locally to ensure everything works correctly.
- Once everything looks great, we will merge the updates into the `main` branch as part of an official release.

<br>

## 💡 Recommendations

- If you have questions before starting, open an **Issue** to discuss your idea.
- Please check the project Wiki — you’ll find visual explanations and documentation that can help you.
- Be patient: as the project owner, I manually review each contribution, and this may take some time.

<br>

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's [GNU GPL v3.0 License](LICENSE.md) with additional terms.

<br>

***Thank you for helping improve this project!*** 🌟
