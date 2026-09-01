#!/bin/bash

# Build script for Copy Frame or Page URL extension
# Usage: ./build.sh [version]
# Example: ./build.sh 1.5.0

set -e

# Check if web-ext is installed
if ! command -v web-ext &> /dev/null; then
    echo "Error: web-ext is not installed."
    echo "Install it with: npm install --global web-ext"
    exit 1
fi

# Get version from manifest.json or command line
if [ -n "$1" ]; then
    VERSION=$1
    echo "Building version: $VERSION"
    # Update version in manifest.json
    sed -i "s/\"version\": \"[0-9.]\*\"/\"version\": \"$VERSION\"/" manifest.json
    git add manifest.json
    git commit -m "chore: Bump version to $VERSION"
else
    VERSION=$(grep '"version"' manifest.json | cut -d'"' -f4)
    echo "Building current version: $VERSION"
fi

# Clean previous builds
rm -rf web-ext-artifacts

# Build the extension
echo "Building XPI file..."
web-ext build

# Rename the artifact
ARTIFACT_NAME="copy-frame-or-page-url-$VERSION.xpi"
ARTIFACT_PATH="web-ext-artifacts/$ARTIFACT_NAME"

if [ -f "web-ext-artifacts/copy_frame_or_page_url-1.0-an+fx.xpi" ]; then
    mv "web-ext-artifacts/copy_frame_or_page_url-1.0-an+fx.xpi" "$ARTIFACT_PATH"
elif [ -f "web-ext-artifacts/copy-frame-or-page-url-$VERSION-an+fx.xpi" ]; then
    mv "web-ext-artifacts/copy-frame-or-page-url-$VERSION-an+fx.xpi" "$ARTIFACT_PATH"
else
    # Find the first .xpi file and rename it
    XPI_FILE=$(find web-ext-artifacts -name "*.xpi" | head -n 1)
    if [ -n "$XPI_FILE" ]; then
        mv "$XPI_FILE" "$ARTIFACT_PATH"
    else
        echo "Error: No XPI file found in web-ext-artifacts/"
        exit 1
    fi
fi

echo "✅ Build successful!"
echo "📦 Artifact: $ARTIFACT_PATH"
echo ""
echo "To create a GitHub release:"
echo "  gh release create v$VERSION $ARTIFACT_PATH -t \"v$VERSION\" -n \"Release notes\""
