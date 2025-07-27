#!/bin/bash
# Deployment script for building Tailwind CSS

# Exit on error
set -e

# Ensure local dependencies are installed
echo "Installing npm packages..."
npm install

echo "Building Tailwind CSS..."
npm run build

echo "Deploy complete."
