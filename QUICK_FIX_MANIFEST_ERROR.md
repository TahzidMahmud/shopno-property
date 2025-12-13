# Quick Fix: Vite Manifest Not Found Error

## Problem
You're seeing: `Vite manifest not found at: /public/build/manifest.json`

This happens because the assets weren't built before uploading to the server.

## Solution

### Step 1: Build Assets Locally

On your local machine, run:

```bash
cd /path/to/shopno-property
npm install
npm run build
```

This will create the `public/build/` directory with:
- `manifest.json` (required file)
- `assets/` folder with all compiled files

### Step 2: Upload the Build Directory

**Option A: Via cPanel File Manager**
1. Log in to cPanel
2. Go to File Manager
3. Navigate to `public/build/` directory
4. Delete the existing `build` folder (if it exists)
5. Upload the new `public/build/` folder from your local machine

**Option B: Via FTP**
1. Connect via FTP client
2. Navigate to `public/` directory
3. Delete the `build` folder (if it exists)
4. Upload the entire `build` folder from your local `public/build/` directory

### Step 3: Verify

After uploading, check that these files exist:
- `public/build/manifest.json` ✓
- `public/build/assets/` folder with files ✓

### Step 4: Clear Browser Cache

Clear your browser cache or do a hard refresh (Ctrl+F5 or Cmd+Shift+R)

## Prevention

**Always build assets before uploading:**

```bash
npm run build
```

Then upload the `public/build/` folder along with other files.

## Alternative: Build Script

You can create a simple script to build and prepare for upload:

```bash
#!/bin/bash
npm install
npm run build
echo "Build complete! Upload the public/build/ directory to your server."
```


