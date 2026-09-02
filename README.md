# Copy Frame or Page URL (Decoded)

A Firefox WebExtension that lets you quickly copy URLs from frames, links, or the current page to your clipboard. Supports plain URLs, Markdown links, and HTML links.

**Note:** This is a modified fork of the original extension. The original extension by Jefferson "jscher2000" Scher is available at [jscher2000/copy-frame-or-page-url](https://github.com/jscher2000/copy-frame-or-page-url). It was further modified by [Hamada Masatoshi](https://github.com/HamadaMasatoshi/copy-frame-or-page-url) (i18n) before being adapted by [Stefan Winopal](https://github.com/wnpl) (Manifest V3, icon refresh, dark mode styling, build automation). This fork includes additional features like internationalization support, automatic theme switching, and improved options.

## Features

- **Copy Frame URLs**: Right-click on any frame to copy its URL to the clipboard
- **Copy Page URLs**: Copy the URL of the current page with a right-click or toolbar button
- **Copy Link URLs**: Right-click on any link to copy its decoded URL
- **Multiple Formats**: Choose between plain URL, Markdown (`[title](url)`), or HTML (`<a href="url">title</a>`)
- **Modifier Key Support**: Use Shift+click or Ctrl+click (Cmd+click on Mac) on the toolbar button for different formats
- **Unicode Decoding**: Option to decode Unicode characters in URLs (e.g., 茶 instead of `%E8%8C%B6`)
- **Address Bar Button**: Optional button in the address bar (page action)
- **Keyboard Shortcuts**: Configurable keyboard shortcuts for quick access

## Installation

### From Source (Recommended for this Fork)

Since this is a modified fork, there is currently no separate AMO listing. You can install it directly from source:

1. Clone this repository or download the source code
2. In Firefox, go to `about:debugging`
3. Click "This Firefox" (left sidebar)
4. Click "Load Temporary Add-on..."
5. Select any file in the extension directory (e.g., `manifest.json`)

### Original AMO Listing

The original extension is available on [Mozilla Add-ons](https://addons.mozilla.org/firefox/addon/copy-frame-or-page-url/) by Jefferson "jscher2000" Scher.

## Usage

### Context Menu (Right-Click)

| Menu Item | Description | Available On |
|-----------|-------------|-------------|
| **Copy Framed Page URL** | Copies the URL of the clicked frame | Frames |
| **Copy Decode URL** | Copies the decoded URL of the clicked link | Links |
| **Copy Page URL** | Copies the URL of the current page | Pages, Selections |

### Toolbar Button

- **Plain click**: Copies URL in the format specified in Options (default: plain URL)
- **Shift+click**: Copies URL in the format specified for Shift+click in Options (default: Markdown)
- **Ctrl+click** (Cmd+click on Mac): Copies URL in the format specified for Ctrl+click in Options (default: HTML)

### Keyboard Shortcuts

Configure keyboard shortcuts via Firefox Add-ons Manager:

1. Go to `about:addons`
2. Find "Copy Frame or Page URL (Decoded)"
3. Click the gear icon (⚙️) → "Manage Extension Shortcuts"
4. Set your preferred shortcuts for:
   - Copy Current Page URL
   - Copy Markdown of Current Page
   - Copy HTML Link of Current Page

## Options

Open the Options page via:
- Right-click the toolbar button → "Options"
- Or go to `about:addons` → Find the extension → Click "Options"

### Available Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Show context menu item on all pages, framed or not** | Shows the "Copy Page URL" context menu item on all pages, not just framed pages | ✅ Enabled |
| **Show button inside address bar** | Displays a button in the address bar (page action) | ❌ Disabled |
| **Plain click** | Format for plain click on toolbar button | Plain URL |
| **Shift+click** | Format for Shift+click on toolbar button | Markdown |
| **Ctrl+click** | Format for Ctrl+click on toolbar button | HTML |
| **Decode Unicode characters in the URL** | Decodes Unicode characters (e.g., 茶 instead of `%E8%8C%B6`) | ✅ Enabled |

### Format Options

| Format | Example Output |
|--------|----------------|
| Plain URL | `https://example.com/page` |
| Markdown | `[Example Page](https://example.com/page)` |
| HTML | `<a href="https://example.com/page">Example Page</a>` |

## Internationalization (i18n)

This extension supports multiple languages:

| Language | Code | Status |
|----------|------|--------|
| English | `en` | ✅ Default |
| German | `de` | ✅ Available |

### Adding a New Language

1. Create a new directory under `_locales/` named with the [language code](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization#Locale_code) (e.g., `_locales/fr/` for French)
2. Create a `messages.json` file in that directory
3. Copy the contents of `_locales/en/messages.json` as a template
4. Translate all `message` values (keep `description` in English)
5. Submit a pull request

## Development

### Project Structure

```
.
├── _locales/           # Internationalization files
│   ├── en/            # English (default)
│   │   └── messages.json
│   └── de/            # German
│       └── messages.json
├── background.js       # Background script (handles menus, commands)
├── manifest.json       # Extension manifest
├── options.html        # Options page
├── options.js          # Options page logic
└── icons/              # Extension icons
    ├── link-16.svg
    ├── link-32.svg
    ├── link-48.svg
    └── link-64.svg
```

### Building

This extension uses the WebExtensions API and requires Firefox. No build step is needed for development, but you can create an XPI file for distribution:

```bash
# Install web-ext
npm install --global web-ext

# Build the XPI file
web-ext build

# The XPI will be in web-ext-artifacts/
```

### Testing

Use the [`web-ext` tool](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) for testing:

```bash
# Run the extension in a temporary Firefox profile
web-ext run

# Run with a specific locale
web-ext run --locale de

# Lint the extension
web-ext lint
```

### Debugging

- Open `about:debugging` in Firefox
- Load the extension as a temporary add-on
- View logs in the Browser Console (`Ctrl+Shift+J`)
- Use `console.log()` in background scripts

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Related Repositories

- [jscher2000/copy-frame-or-page-url](https://github.com/jscher2000/copy-frame-or-page-url) - Original repository by Jefferson Scher
- [HamadaMasatoshi/copy-frame-or-page-url](https://github.com/HamadaMasatoshi/copy-frame-or-page-url) - Fork with i18n and build automation
- [Mozilla Add-ons Listing](https://addons.mozilla.org/firefox/addon/copy-frame-or-page-url/) - Original extension on AMO

## License

This project is based on the original work by Jefferson "jscher2000" Scher, licensed under [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/).

## Credits

- Original extension by [Jefferson "jscher2000" Scher](https://github.com/jscher2000/copy-frame-or-page-url)
- Fork with i18n by [Hamada Masatoshi](https://github.com/HamadaMasatoshi/copy-frame-or-page-url)
- Manifest V3 migration, icon refresh, and dark mode styling by [Stefan Winopal](https://github.com/wnpl)
- Icons from [FirefoxUX/acorn-icons](https://github.com/FirefoxUX/acorn-icons) (MPL-2.0)
