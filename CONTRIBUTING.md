# Contributing to Copy Frame or Page URL

Thank you for your interest in contributing to this project! All contributions are welcome, whether it's bug reports, feature requests, code improvements, or translations.

## Ways to Contribute

- **Reporting Bugs**: Found a bug? [Open an issue](https://github.com/wnpl/copy-frame-or-page-url/issues)
- **Suggesting Features**: Have an idea? [Open an issue](https://github.com/wnpl/copy-frame-or-page-url/issues)
- **Code Contributions**: Submit a pull request
- **Translations**: Help translate the extension to your language

---

## Reporting Issues

When reporting an issue, please include the following information:

1. **Firefox Version**: Which version of Firefox are you using?
2. **Extension Version**: Which version of the extension are you using?
3. **Operating System**: Windows, macOS, Linux?
4. **Steps to Reproduce**: How can we reproduce the issue?
5. **Expected Behavior**: What did you expect to happen?
6. **Actual Behavior**: What actually happened?
7. **Screenshots or Videos**: If applicable, add screenshots or videos
8. **Error Messages**: Any error messages in the browser console?

---

## Setting Up for Development

### Prerequisites

- [Firefox](https://www.mozilla.org/firefox/) (latest version recommended)
- [Git](https://git-scm.com/)
- Optional: [Node.js](https://nodejs.org/) for `web-ext` tool

### Clone the Repository

```bash
git clone https://github.com/wnpl/copy-frame-or-page-url.git
cd copy-frame-or-page-url
```

### Load as Temporary Add-on

1. In Firefox, go to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on..."
4. Select any file in the extension directory (e.g., `manifest.json`)

The extension will be loaded and active until you restart Firefox.

### Using web-ext (Recommended)

The [`web-ext` tool](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) provides a better development experience:

```bash
# Install web-ext globally
npm install --global web-ext

# Run the extension with auto-reload
web-ext run

# Run with a specific locale for testing translations
web-ext run --locale de

# Lint the extension
web-ext lint
```

---

## Code Contributions

### Branch Naming Convention

Please use the following branch naming convention:

- `feature/short-description` for new features
- `fix/short-description` for bug fixes
- `docs/short-description` for documentation updates
- `refactor/short-description` for code refactoring
- `i18n/language-code` for translation additions (e.g., `i18n/fr`)

### Commit Message Convention

Please write clear, descriptive commit messages:

```
Type: Short description

Longer description if needed.

- Bullet points for additional context
- Keep it concise
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `i18n`

Example:
```
feat: Add keyboard shortcut for HTML format

Adds a new command 'copy-page-url-as-html' that can be
configured in Firefox extension shortcuts.

- Updates manifest.json with new command
- Updates background.js with new command handler
```

### Pull Request Guidelines

1. **One Feature per PR**: Each pull request should address one specific issue or feature
2. **Clear Title**: Use a clear, descriptive title
3. **Detailed Description**: Explain what the PR does and why it's needed
4. **Reference Issues**: Link to any related issues using `Closes #123` or `Fixes #123`
5. **Test Your Changes**: Make sure your changes work as expected
6. **Keep it Small**: Smaller PRs are easier to review

### Code Style

- Use consistent indentation (tabs or spaces as used in the file)
- Follow the existing code patterns
- Add comments for non-obvious logic
- Keep functions small and focused
- Use descriptive variable and function names

---

## Translating the Extension

We welcome translations to new languages! Here's how to add a translation:

### Adding a New Language

1. **Fork the repository** and create a new branch (e.g., `i18n/fr` for French)

2. **Create the locale directory**:
   ```bash
   mkdir -p _locales/fr
   ```

3. **Create messages.json**:
   ```bash
   cp _locales/en/messages.json _locales/fr/messages.json
   ```

4. **Translate the messages**:
   - Open `_locales/fr/messages.json`
   - Translate all `message` values to your language
   - **Do NOT translate** the `description` fields (keep them in English)
   - **Do NOT translate** the keys (e.g., `extensionName`, `menuCopyPageUrl`)

5. **Test your translation**:
   ```bash
   web-ext run --locale fr
   ```

6. **Submit a pull request**

### Translation Guidelines

- **Be natural**: Translate in a way that sounds natural in your language
- **Be consistent**: Use consistent terminology throughout
- **Keep it short**: Some strings have limited space (e.g., context menu items)
- **Preserve meaning**: Ensure the translation conveys the same meaning as the original
- **Handle placeholders**: Some strings contain placeholders like `$1`, `$2`. These will be replaced with dynamic values. Keep the placeholders in your translation.

### Example Translation

English (`_locales/en/messages.json`):
```json
{
  "menuCopyPageUrl": {
    "message": "Copy Page URL",
    "description": "Context menu item for copying the page URL"
  }
}
```

French (`_locales/fr/messages.json`):
```json
{
  "menuCopyPageUrl": {
    "message": "Copier l'URL de la page",
    "description": "Context menu item for copying the page URL"
  }
}
```

### Special Characters

- **HTML entities**: In `messages.json`, use the actual characters (e.g., `<` instead of `&lt;`) for readability. The extension will handle escaping as needed.
- **Quotes**: Escape double quotes with backslash (`\"`)
- **Newlines**: Use `\n` for newlines if needed

---

## Testing

Before submitting a pull request, please test your changes:

### Manual Testing

1. Load the extension as a temporary add-on
2. Test all features:
   - Context menu items (right-click on frames, links, pages)
   - Toolbar button (plain click, Shift+click, Ctrl+click)
   - Options page (change settings and verify they work)
   - Keyboard shortcuts (if applicable)

### Automated Testing

Run the linter to check for common issues:
```bash
web-ext lint
```

---

## Code of Conduct

We expect all contributors to follow the [Mozilla Community Participation Guidelines](https://www.mozilla.org/en-US/about/governance/policies/participation/).

Be respectful, inclusive, and collaborative.

---

## License

By contributing to this project, you agree to license your contributions under the [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/) license.

---

## Need Help?

If you have questions or need help with your contribution:

1. Check the [existing issues](https://github.com/wnpl/copy-frame-or-page-url/issues) for similar questions
2. Open a new issue with your question
3. Join the discussion on the pull request

We're happy to help!
