<?php
/**
 * Storage Fix Script - Force Copy Files
 * 
 * This script forcefully copies files from storage/app/public to public/storage
 * It handles permission issues and provides detailed feedback
 */

$storagePath = __DIR__ . '/../storage/app/public';
$publicStoragePath = __DIR__ . '/storage';

$message = '';
$error = '';
$copied = 0;
$failed = 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['fix'])) {
    // Ensure destination directory exists
    if (!is_dir($publicStoragePath)) {
        @mkdir($publicStoragePath, 0755, true);
    }
    
    // Create .htaccess
    $htaccessContent = "Options -Indexes +FollowSymLinks\n<IfModule mod_rewrite.c>\n    RewriteEngine Off\n</IfModule>\n";
    @file_put_contents($publicStoragePath . '/.htaccess', $htaccessContent);
    
    // Create index.php
    @file_put_contents($publicStoragePath . '/index.php', "<?php\nheader('HTTP/1.0 403 Forbidden');\nexit;\n");
    
    if (!is_dir($storagePath)) {
        $error = "Source directory does not exist: {$storagePath}";
    } else {
        // Use a more robust copying method
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($storagePath, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );
        
        $details = [];
        
        foreach ($iterator as $item) {
            $sourcePath = $item->getPathname();
            $relativePath = str_replace($storagePath . DIRECTORY_SEPARATOR, '', $sourcePath);
            $destinationPath = $publicStoragePath . DIRECTORY_SEPARATOR . $relativePath;
            
            if ($item->isDir()) {
                // Create directory
                if (!is_dir($destinationPath)) {
                    if (@mkdir($destinationPath, 0755, true)) {
                        $details[] = "Created directory: {$relativePath}";
                    } else {
                        $details[] = "Failed to create directory: {$relativePath}";
                        $failed++;
                    }
                }
            } else {
                // Copy file
                $destinationDir = dirname($destinationPath);
                if (!is_dir($destinationDir)) {
                    @mkdir($destinationDir, 0755, true);
                }
                
                // Try multiple copy methods
                $success = false;
                $errorMsg = '';
                
                // Method 1: Standard copy
                if (@copy($sourcePath, $destinationPath)) {
                    @chmod($destinationPath, 0644);
                    $success = true;
                } 
                // Method 2: file_get_contents + file_put_contents (for large files or permission issues)
                else {
                    $sourceHandle = @fopen($sourcePath, 'rb');
                    if ($sourceHandle) {
                        $destHandle = @fopen($destinationPath, 'wb');
                        if ($destHandle) {
                            $copiedBytes = 0;
                            while (!feof($sourceHandle)) {
                                $data = fread($sourceHandle, 8192);
                                if ($data === false) break;
                                $written = fwrite($destHandle, $data);
                                if ($written === false) break;
                                $copiedBytes += $written;
                            }
                            fclose($destHandle);
                            fclose($sourceHandle);
                            
                            if ($copiedBytes > 0 && filesize($sourcePath) == $copiedBytes) {
                                @chmod($destinationPath, 0644);
                                $success = true;
                            } else {
                                $errorMsg = "Partial copy (expected " . filesize($sourcePath) . " bytes, got {$copiedBytes})";
                            }
                        } else {
                            fclose($sourceHandle);
                            $errorMsg = "Cannot open destination for writing";
                        }
                    } else {
                        $errorMsg = "Cannot open source for reading";
                    }
                }
                
                if ($success) {
                    $copied++;
                    if ($copied <= 20) {
                        $details[] = "✓ Copied: {$relativePath}";
                    }
                } else {
                    $failed++;
                    $details[] = "✗ Failed: {$relativePath}" . ($errorMsg ? " ({$errorMsg})" : "");
                }
            }
        }
        
        if ($copied > 0) {
            $message .= "✓ Successfully copied {$copied} files.<br>";
        }
        if ($failed > 0) {
            $error .= "⚠ Failed to copy {$failed} files (likely permission issues).<br>";
        }
        
        if (count($details) > 0) {
            $message .= "<div style='max-height: 400px; overflow-y: auto; background: #f8f9fa; padding: 10px; border-radius: 4px; font-size: 11px; font-family: monospace; margin: 10px 0;'>";
            $message .= implode("<br>", $details);
            if ($copied > 20) {
                $message .= "<br>... and " . ($copied - 20) . " more files copied";
            }
            $message .= "</div>";
        }
        
        // Verify uploads directory
        $uploadsCheck = $publicStoragePath . '/uploads';
        if (is_dir($uploadsCheck)) {
            $uploadFiles = glob($uploadsCheck . '/**/*', GLOB_BRACE);
            $message .= "<br>✓ Uploads directory verified. Found " . count($uploadFiles) . " files in public/storage/uploads/";
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Storage Fix - Force Copy</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
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
        }
        .warning {
            background: #fff3cd;
            color: #856404;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .btn {
            background: #667eea;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
        }
        .btn:hover { background: #5568d3; }
        .btn-danger {
            background: #dc3545;
        }
        .btn-danger:hover { background: #c82333; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Storage Fix - Force Copy Files</h1>
        
        <div class="warning">
            <strong>⚠️ Important:</strong> This script will copy all files from <code>storage/app/public/</code> to <code>public/storage/</code>.
            <br><br>
            <strong>Current Status:</strong><br>
            - Source: <code><?= htmlspecialchars($storagePath) ?></code><br>
            - Destination: <code><?= htmlspecialchars($publicStoragePath) ?></code><br>
            <?php if (is_dir($storagePath)): ?>
                - Source exists: ✓<br>
            <?php else: ?>
                - Source exists: ✗<br>
            <?php endif; ?>
            <?php if (is_dir($publicStoragePath)): ?>
                - Destination exists: ✓<br>
            <?php else: ?>
                - Destination exists: ✗ (will be created)<br>
            <?php endif; ?>
        </div>
        
        <?php if ($error): ?>
            <div class="message error"><?= $error ?></div>
        <?php endif; ?>
        
        <?php if ($message): ?>
            <div class="message success"><?= $message ?></div>
        <?php endif; ?>
        
        <form method="POST">
            <button type="submit" name="fix" class="btn">Force Copy All Files</button>
        </form>
        
        <h2>After Running This Script</h2>
        <p>Test if images load by visiting:</p>
        <p><code>https://test.shopnoproperty.com/storage/uploads/properties/main/693467bbc11f5.webp</code></p>
        <p>If the image loads, the fix worked! If you get 404, the files weren't copied successfully.</p>
        
        <h2>Alternative: Manual Copy via cPanel</h2>
        <p>If this script still fails, copy files manually:</p>
        <ol>
            <li>Go to <strong>cPanel → File Manager</strong></li>
            <li>Navigate to <code>storage/app/public/uploads/</code></li>
            <li>Select all files and folders</li>
            <li>Click <strong>Copy</strong></li>
            <li>Navigate to <code>public/storage/</code></li>
            <li>Click <strong>Paste</strong></li>
        </ol>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
            <strong>Note:</strong> For security, delete this file after use.
        </p>
    </div>
</body>
</html>

