<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SyncStorage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'storage:sync-shared-hosting';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync storage files to public/storage for shared hosting (when symlinks are not supported)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $storagePath = storage_path('app/public');
        $publicStoragePath = public_path('storage');

        $this->info('Syncing storage files for shared hosting...');

        // Create public/storage directory if it doesn't exist
        if (!File::exists($publicStoragePath)) {
            File::makeDirectory($publicStoragePath, 0755, true);
            $this->info("Created directory: {$publicStoragePath}");
        }

        // Copy .htaccess if it doesn't exist
        $htaccessPath = $publicStoragePath . '/.htaccess';
        if (!File::exists($htaccessPath)) {
            $htaccessContent = "# Allow access to storage files\nOptions -Indexes\n<IfModule mod_headers.c>\n    Header set Access-Control-Allow-Origin \"*\"\n</IfModule>\n";
            File::put($htaccessPath, $htaccessContent);
            $this->info('Created .htaccess in storage directory');
        }

        // Copy index.php to prevent directory listing
        $indexPath = $publicStoragePath . '/index.php';
        if (!File::exists($indexPath)) {
            File::put($indexPath, "<?php\n// Prevent directory listing\nheader('HTTP/1.0 403 Forbidden');\nexit;\n");
        }

        // Sync files
        $this->syncDirectory($storagePath, $publicStoragePath);

        $this->info('Storage sync completed successfully!');
        return 0;
    }

    /**
     * Recursively sync directory contents
     */
    private function syncDirectory($source, $destination)
    {
        if (!File::exists($source)) {
            $this->warn("Source directory does not exist: {$source}");
            return;
        }

        $files = File::allFiles($source);

        foreach ($files as $file) {
            $relativePath = str_replace($source . DIRECTORY_SEPARATOR, '', $file->getPathname());
            $destPath = $destination . DIRECTORY_SEPARATOR . $relativePath;
            $destDir = dirname($destPath);

            // Create destination directory if it doesn't exist
            if (!File::exists($destDir)) {
                File::makeDirectory($destDir, 0755, true);
            }

            // Copy file if it doesn't exist or source is newer
            if (!File::exists($destPath) || File::lastModified($file->getPathname()) > File::lastModified($destPath)) {
                File::copy($file->getPathname(), $destPath);
                $this->line("Copied: {$relativePath}");
            }
        }
    }
}


