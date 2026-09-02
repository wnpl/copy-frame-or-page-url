# Agent Guidelines for copy-link-to-page

This file provides instructions for AI agents working on this repository.

## Version Management

### Version Files
This extension tracks its version in multiple files that must stay in sync:
- `manifest.json` - Primary version (authoritative)
- `package.json` - Node.js/WebExtension tooling version

### Version Update Rules

**When updating the extension version:**

1. **Always update BOTH files together** in a single commit:
   ```bash
   # Update manifest.json
   sed -i 's/"version": "[0-9.]\*"/"version": "X.Y.Z"/' manifest.json
   
   # Update package.json
   sed -i 's/"version": "[0-9.]\*"/"version": "X.Y.Z"/' package.json
   
   # Commit both changes
   git add manifest.json package.json
   git commit -m "chore: Bump version to X.Y.Z"
   ```

2. **When creating a release tag**, verify all version files are synchronized:
   ```bash
   # Check versions match
   grep '"version"' manifest.json package.json
   
   # Create annotated tag
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin vX.Y.Z
   ```

3. **Never** commit a version change to only one file

## Build & Release

### Build Process
```bash
# Install dependencies
npm install

# Build XPI
npm run build  # or: web-ext build

# Lint
npm run lint  # or: web-ext lint
```

### Release Checklist
- [ ] `manifest.json` version updated
- [ ] `package.json` version updated
- [ ] All locale files complete
- [ ] README.md updated with new features
- [ ] CHANGELOG/Release notes prepared
- [ ] Tag created: `vX.Y.Z`
- [ ] Tag pushed to origin

## File Conventions

### Localization
- All user-facing strings in `_locales/*/messages.json`
- Use sentence case for Firefox-native styling (not title case)
- Prefer "Link" over "URL" for accessibility
- Platform-specific text (Mac vs others) handled via `browser.runtime.getPlatformInfo()`

### Icons
- Use FirefoxUX acorn-icons for consistency
- SVG icons with `prefers-color-scheme` media queries for auto theme switching
- Icon sizes: 16, 32, 48, 64 pixels

### Manifest
- Manifest V3
- Add-on ID: `copy-link-to-page@wnpl.de`
- Developer: Stefan Winopal / https://github.com/wnpl

## Testing

### Manual Tests
1. Install from source via `about:debugging` → "Load Temporary Add-on"
2. Test context menu on frames, links, and pages
3. Test toolbar button with all modifiers (plain, Shift, Ctrl/Cmd)
4. Test options page in both light and dark mode
5. Test all locales

### Platform-Specific Tests
- Mac: Verify Cmd+click label appears
- Windows/Linux: Verify Strg+Klick label appears

## Common Pitfalls

1. **Line endings**: Use LF, not CRLF (Windows line endings break Firefox extensions)
2. **Non-ASCII characters**: Avoid in JavaScript files, use Unicode escapes if needed
3. **Comment syntax**: Ensure `/* comment */` blocks are properly closed
4. **Theme variables**: Firefox theme CSS variables (e.g., `--theme-icon-fill`) don't work in extensions - use `prefers-color-scheme` media queries instead

## Attribution

When using third-party assets:
- Preserve original copyright notices
- Add attribution to README.md
- MPL-2.0 compliant licensing

Current attributions:
- Original extension: Jefferson "jscher2000" Scher
- Custom context menu and decoded URL support: Hamada Masatoshi
- Manifest V3, icons, i18n, build automation: Stefan Winopal
- Icons: FirefoxUX/acorn-icons (MPL-2.0)
