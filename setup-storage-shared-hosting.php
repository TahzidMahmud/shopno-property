<?php
/**
 * Storage Setup Script for Shared Hosting
 * 
 * This script creates a copy of storage files to public/storage
 * since symlinks may not work on shared hosting.
 * 
 * Run this script once after deployment:
 * php setup-storage-shared-hosting.php
 */

$storagePath = __DIR__ . '/storage/app/public';
$publicStoragePath = __DIR__ . '/public/storage';

echo "Setting up storage for shared hosting...\n";

// Check if storage directory exists
if (!is_dir($storagePath)) {
    echo "Error: Storage directory not found at: $storagePath\n";
    exit(1);
}

// Create public/storage directory if it doesn't exist
if (!is_dir($publicStoragePath)) {
    if (!mkdir($publicStoragePath, 0755, true)) {
        echo "Error: Could not create directory: $publicStoragePath\n";
        exit(1);
    }
    echo "Created directory: $publicStoragePath\n";
}

// Copy .htaccess to storage
$htaccessContent = "# Allow access to storage files\nOptions -Indexes\n<IfModule mod_headers.c>\n    Header set Access-Control-Allow-Origin \"*\"\n</IfModule>\n";
file_put_contents($publicStoragePath . '/.htaccess', $htaccessContent);
echo "Created .htaccess in storage directory\n";

// Function to copy directory recursively
function copyDirectory($src, $dst) {
    $dir = opendir($src);
    if (!is_dir($dst)) {
        mkdir($dst, 0755, true);
    }
    while (($file = readdir($dir)) !== false) {
        if ($file != '.' && $file != '..') {
            $srcFile = $src . '/' . $file;
            $dstFile = $dst . '/' . $file;
            if (is_dir($srcFile)) {
                copyDirectory($srcFile, $dstFile);
            } else {
                copy($srcFile, $dstFile);
            }
        }
    }
    closedir($dir);
}

// Copy all files from storage/app/public to public/storage
echo "Copying files from storage/app/public to public/storage...\n";
copyDirectory($storagePath, $publicStoragePath);
echo "Storage setup completed successfully!\n";
echo "Note: You may need to run this script periodically if you upload new files via the admin panel.\n";
echo "Alternatively, you can set up a cron job or use FTP to sync files.\n";

