# QuantumultX Parser Maintenance

This directory contains the maintenance setup for a customized Quantumult X resource parser.

## Structure

- `upstream/resource-parser.js`: Latest upstream script downloaded during build
- `patches/defaults.js`: Custom default parameters
- `patches/get_emoji.js`: Custom `get_emoji` patch
- `scripts/build-parser.js`: Build script that downloads upstream and applies patches
- `myParser.js`: Generated parser for daily use in Quantumult X

## Usage

To update the parser locally:

1. Run:
   ```
   node Parser/scripts/build-parser.js
   ```
2. The script will:
   - Download the latest upstream parser into `Parser/upstream/resource-parser.js`
   - Apply the local patches in `Parser/patches/`
   - Generate `Parser/myParser.js`

## GitHub Actions

The GitHub Actions workflow only updates files inside the `Parser` directory.

- Build script: `Parser/scripts/build-parser.js`
- Upstream cache: `Parser/upstream/resource-parser.js`
- Final output: `Parser/myParser.js`

The root-level `myParser.js` is kept temporarily as a backup and is not part of the new automated Parser workflow.

## Quantumult X Configuration

Use the `Parser/myParser.js` file as the parser URL in Quantumult X.

Example raw URL:

```
https://raw.githubusercontent.com/<your-name>/<your-repo>/<your-branch>/Parser/myParser.js
```

The old root-level parser path can remain in the repository for backup purposes.
