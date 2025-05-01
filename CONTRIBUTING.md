# Contributing to Kim Chat

First off, thank you for considering contributing to **Kim Chat**! Your contributions help us build a better, faster, and seamless chat application. Whether you're reporting bugs, suggesting features, improving documentation, or contributing code, we greatly appreciate your efforts.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Improving Documentation](#improving-documentation)
  - [Contributing Code](#contributing-code)
- [Getting Started](#getting-started)
- [Styleguides](#styleguides)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript Styleguide](#javascript-styleguide)
- [Additional Notes](#additional-notes)

---

## Code of Conduct
This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold this code. Please report any unacceptable behavior to maintainer.

---

## How Can I Contribute?

### Reporting Bugs
If you encounter a bug, please let us know by [creating an issue](https://github.com/frustateduser/kim_chat/issues/new/choose). Before submitting, check if:
- The issue already exists in the [issues list](https://github.com/frustateduser/kim_chat/issues).
- You’re running the latest version of the application.

When reporting a bug, include:
- A clear and descriptive title.
- Steps to reproduce the issue.
- Expected versus actual behavior.
- Relevant screenshots or code snippets (if applicable).
- Your environment (browser version, OS, Node.js version, etc.).

### Suggesting Features
We welcome feature suggestions! To suggest a feature:
1. Check the [issues list](https://github.com/frustateduser/kim_chat/issues) to ensure the feature hasn’t already been suggested.
2. Open a [new feature request](https://github.com/frustateduser/kim_chat/issues/new/choose).
3. Provide a detailed explanation of the feature, its benefits, and any implementation ideas.

### Improving Documentation
Good documentation is critical! If you find areas in the documentation that can be improved:
- Fork the repository.
- Make your changes (see Getting Started).
- Open a pull request with your improvements.

### Contributing Code
We welcome contributions to the codebase! Before you start:
- Check the [issues list](https://github.com/frustateduser/kim_chat/issues) for open issues or tasks.
- Comment on the issue to let others know you’re working on it.
- Follow the Getting Started guide below.

---

## Getting Started
1. **Fork the Repository**:
   Click on the "Fork" button on the top-right of this repository.

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/your-username/kim_chat.git
   cd kim_chat
   ```

3. **Install Dependencies**:
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```
   run this command in 'kim_chat_frontend' and 'kim_chat_backend' seprately.

4. **Run the Project**:
   Start the project locally:
   ```bash
   npm start
   ```

5. **Run Tests** (if applicable):
   ```bash
   npm test
   ```

6. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

7. **Commit Your Changes**:
   Follow the Git Commit Messages guidelines.

8. **Push Your Changes**:
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Open a Pull Request (PR)**:
   - Go to your fork on GitHub.
   - Click "Compare & pull request".
   - Fill out the PR template and submit it.

---

## Styleguides

### Git Commit Messages
- Use the present tense (e.g., "Add feature" instead of "Added feature").
- Keep messages concise but descriptive.
- Prefix messages with the type of change:
  - `feat:` for new features.
  - `fix:` for bug fixes.
  - `docs:` for documentation updates.
  - `test:` for adding or updating tests.
  - `refactor:` for code improvements.

Example:
```
feat: Add real-time messaging support
```

### JavaScript Styleguide
- Use **Prettier** for formatting.
- Adhere to **ESLint** rules configured in the repository.
- Use `camelCase` for variables and functions.
- Write meaningful variable and function names.
- Add comments to explain complex logic.

---

## Additional Notes
- Be respectful and collaborative in discussions.
- If you’re unsure about anything, feel free to ask questions in the issue or pull request.

---

By contributing, you help make **Kim Chat** a better application. Thank you for your time and effort!

---
