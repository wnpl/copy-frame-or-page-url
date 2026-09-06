# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2025-09-06

### Added

- **Link Storage (Link-Speicher)**: Complete link history feature with sidebar integration
  - Store up to 100 copied links with timestamp
  - Access history via Firefox sidebar (F9 or View → Sidebar → Link Storage)
  - Links persist across browser restarts using localStorage
  - Automatic FIFO (First-In-First-Out) rotation when 100-link limit is reached
- **Sidebar UI**: Responsive card-based interface for viewing stored links
  - Each card displays title, URL, creation timestamp
  - Shows original URL if link was cleaned
  - Dark/light mode support
- **Quick Actions on Link Cards**
  - "Copy Again" button to re-copy any stored link
  - "Bookmark" button to save links permanently to "Other Bookmarks" (Weitere Lesezeichen)
  - "Delete" button to remove individual links
  - "Delete All" button with confirmation dialog to clear all stored links
- **Icon Buttons**: Replaced text buttons with SVG icons
  - Copy: copy-16.svg
  - Bookmark: bookmark-16.svg
  - Delete: delete-16.svg
  - Settings: gear icon
- **Visual Feedback**: Green checkmark icon on toolbar/page action button after successful copy
  - Only the clicked button shows feedback
  - Automatically resets after 1.5 seconds
- **Private Window Support**: Link storage is automatically disabled in private windows
- **Modifier Key Support for Copy Button**: Respects clickplain/clickshift/clickctrl settings
- **Updated Tooltips**: Dynamic tooltips show the actual format being copied
- **Updated Feedback Messages**: Cleaner messages ("Link kopiert", "Markdown kopiert", "HTML kopiert")

### Changed

- Updated all i18n messages for new features (de/en)
- Improved options page with new Link Storage setting
- Enhanced background.js with link storage logic
- Updated project structure with new files

### Fixed

- Replaced all unsafe `innerHTML` assignments with safe DOM manipulation methods
  - Fixed AMO validation warnings for sidebar.js lines 256, 274, 282, and 82
  - Uses `document.createElement()` and `appendChild()` instead of innerHTML

### Technical Details

- Uses `browser.storage.local` for persistent link storage
- Implements FIFO queue for 100-link limit
- Maintains Manifest V3 compatibility
- Full i18n support for all new features

---

## [1.7.0] - 2025-09-02

### Added

- Tab context menu support
- Address bar button (page action) option
- Dynamic menu labels

### Changed

- Updated to Manifest V3
- Refreshed icons using FirefoxUX acorn-icons
- Added dark mode styling
- Improved internationalization support

---

## [1.6.0] - 2025-09-01

### Added

- Link cleaner support using link-cleaner-js
- Option to remove tracking parameters (UTM, fbclid, etc.)

---

## [1.5.0] - 2025-08-30

### Added

- i18n support (German and English)
- Custom context menu for decoded URLs

---

[2.0.0]: https://github.com/wnpl/copy-frame-or-page-url/compare/v1.7.0...v2.0.0
[1.7.0]: https://github.com/wnpl/copy-frame-or-page-url/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/wnpl/copy-frame-or-page-url/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/wnpl/copy-frame-or-page-url/releases/tag/v1.5.0
