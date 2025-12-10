<?php
/**
 * Web-Based Storage Sync Script
 * 
 * This script syncs files from storage/app/public to public/storage
 * Access it via: https://yourdomain.com/storage-sync.php
 * 
 * Run this after uploading new files through the admin panel.
 */

// Security: Only allow if .env exists and app is configured
$envPath = __DIR__ . '/../.env';
if (!file_exists($envPath)) {
    die('Application not configured. Please run setup.php first.');
}

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['sync'])) {
    $storagePath = __DIR__ . '/../storage/app/public';
    $publicStoragePath = __DIR__ . '/storage';
    
    // Create public/storage directory if it doesn't exist
    if (!is_dir($publicStoragePath)) {
        mkdir($publicStoragePath, 0755, true);
        $message .= 'Created public/storage directory.<br>';
    }
    
    // Create .htaccess in storage
    $htaccessContent = "# Allow access to storage files\nOptions -Indexes\n<IfModule mod_headers.c>\n    Header set Access-Control-Allow-Origin \"*\"\n</IfModule>\n";
    file_put_contents($publicStoragePath . '/.htaccess', $htaccessContent);
    
    // Create index.php to prevent directory listing
    file_put_contents($publicStoragePath . '/index.php', "<?php\n// Prevent directory listing\nheader('HTTP/1.0 403 Forbidden');\nexit;\n");
    
    // Check permissions first
    $permissionIssues = [];
    if (is_dir($storagePath) && !is_readable($storagePath)) {
        $permissionIssues[] = "Source directory not readable: {$storagePath}";
    }
    if (is_dir($publicStoragePath) && !is_writable($publicStoragePath)) {
        $permissionIssues[] = "Destination directory not writable: {$publicStoragePath}";
    }
    
    if (count($permissionIssues) > 0) {
        $error .= "<strong>Permission Issues:</strong><br>";
        foreach ($permissionIssues as $issue) {
            $error .= "⚠ " . htmlspecialchars($issue) . "<br>";
        }
        $error .= "<br><strong>Solution:</strong> Set permissions via cPanel File Manager:<br>";
        $error .= "- <code>storage/app/public/</code> → 755 (readable)<br>";
        $error .= "- <code>public/storage/</code> → 755 (writable)<br>";
    }
    
    // Copy files
    if (is_dir($storagePath)) {
        $result = copyDirectory($storagePath, $publicStoragePath);
        $copied = $result['count'];
        $details = $result['details'];
        $copyErrors = isset($result['errors']) ? $result['errors'] : [];
        
        if ($copied > 0) {
            $message .= "✓ Storage sync completed! Copied {$copied} files.<br><br>";
        } else {
            $message .= "⚠ Storage sync completed but no files were copied.<br><br>";
        }
        
        if (count($copyErrors) > 0) {
            $error .= "<strong>Copy Errors (" . count($copyErrors) . "):</strong><br>";
            $error .= "<div style='max-height: 200px; overflow-y: auto; background: #fff3cd; padding: 10px; border-radius: 4px; font-size: 11px; font-family: monospace; margin: 10px 0;'>";
            $error .= implode("<br>", array_slice($copyErrors, 0, 20));
            if (count($copyErrors) > 20) {
                $error .= "<br>... and " . (count($copyErrors) - 20) . " more errors";
            }
            $error .= "</div>";
        }
        
        if (count($details) > 0) {
            $message .= "<strong>Successfully Copied Files:</strong><br>";
            $message .= "<div style='max-height: 300px; overflow-y: auto; background: #d4edda; padding: 10px; border-radius: 4px; font-size: 11px; font-family: monospace;'>";
            $message .= implode("<br>", array_slice($details, 0, 50));
            if (count($details) > 50) {
                $message .= "<br>... and " . (count($details) - 50) . " more files";
            }
            $message .= "</div>";
        }
        
        // Check if uploads directory exists
        $uploadsPath = $publicStoragePath . '/uploads';
        if (is_dir($uploadsPath)) {
            $message .= "<br>✓ Uploads directory found at: <code>public/storage/uploads/</code>";
            $uploadFiles = glob($uploadsPath . '/**/*', GLOB_BRACE);
            $message .= "<br>Files in uploads: " . count($uploadFiles);
        } else {
            $message .= "<br>⚠ Uploads directory not found. Files may be in a different location.";
        }
        
        $message .= "<br><br><strong>Source:</strong> <code>{$storagePath}</code><br>";
        $message .= "<strong>Destination:</strong> <code>{$publicStoragePath}</code>";
    } else {
        $error .= "Source directory does not exist: <code>{$storagePath}</code><br>";
        $error .= "Please check that files have been uploaded to the server.";
    }
}

function copyDirectory($src, $dst, $basePath = '') {
    $count = 0;
    $details = [];
    $errors = [];
    
    if (!is_dir($dst)) {
        if (!mkdir($dst, 0755, true)) {
            return ['count' => 0, 'details' => [], 'errors' => ["Failed to create directory: {$dst}"]];
        }
    }
    
    if (!is_dir($src)) {
        return ['count' => 0, 'details' => [], 'errors' => ["Source directory does not exist: {$src}"]];
    }
    
    if (!is_readable($src)) {
        return ['count' => 0, 'details' => [], 'errors' => ["Source directory is not readable: {$src}"]];
    }
    
    if (!is_writable($dst)) {
        return ['count' => 0, 'details' => [], 'errors' => ["Destination directory is not writable: {$dst}"]];
    }
    
    $dir = opendir($src);
    if (!$dir) {
        return ['count' => 0, 'details' => [], 'errors' => ["Failed to open source directory: {$src}"]];
    }
    
    while (($file = readdir($dir)) !== false) {
        if ($file == '.' || $file == '..') continue;
        
        $srcFile = $src . '/' . $file;
        $dstFile = $dst . '/' . $file;
        $relativePath = $basePath ? $basePath . '/' . $file : $file;
        
        if (is_dir($srcFile)) {
            $result = copyDirectory($srcFile, $dstFile, $relativePath);
            $count += $result['count'];
            $details = array_merge($details, $result['details']);
            if (isset($result['errors'])) {
                $errors = array_merge($errors, $result['errors']);
            }
        } else {
            // Check if source file is readable
            if (!is_readable($srcFile)) {
                $errors[] = "Source file not readable: {$relativePath}";
                continue;
            }
            
            // Try to copy the file
            $copyResult = @copy($srcFile, $dstFile);
            
            if ($copyResult) {
                // Set permissions on copied file
                @chmod($dstFile, 0644);
                $count++;
                $details[] = "✓ Copied: {$relativePath}";
            } else {
                // Get more detailed error information
                $errorMsg = "✗ Failed: {$relativePath}";
                $lastError = error_get_last();
                if ($lastError && strpos($lastError['message'], 'Permission denied') !== false) {
                    $errorMsg .= " (Permission denied)";
                } elseif ($lastError) {
                    $errorMsg .= " (" . $lastError['message'] . ")";
                }
                $errors[] = $errorMsg;
            }
        }
    }
    closedir($dir);
    return ['count' => $count, 'details' => $details, 'errors' => $errors];
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Storage Sync</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .message {
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .success {
            background: #d4edda;
            color: #155724;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .btn {
            background: #667eea;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .btn:hover { background: #5568d3; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Storage Sync</h1>
        
        <?php if ($error): ?>
            <div class="message error"><?= $error ?></div>
        <?php endif; ?>
        
        <?php if ($message): ?>
            <div class="message success"><?= $message ?></div>
        <?php endif; ?>
        
        <p>This will copy files from <code>storage/app/public/</code> to <code>public/storage/</code></p>
        <p><strong>Run this after uploading new files through the admin panel.</strong></p>
        
        <form method="POST">
            <button type="submit" name="sync" class="btn">Sync Storage Files</button>
        </form>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
            <strong>Note:</strong> For security, consider deleting this file after setup, or protect it with .htaccess.
        </p>
    </div>
</body>
</html>

