<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Intervention\Image\Facades\Image; // Requires composer require intervention/image

class FileUploadService
{
    /**
     * Handles the upload and conversion of a single file to WebP (if an image).
     * Files are saved directly to public/storage/ for shared hosting compatibility.
     *
     * @param UploadedFile $file The uploaded file instance.
     * @param string $path The storage path segment (e.g., 'uploads/properties/main').
     * @return string The storage relative path to the saved file (e.g., 'uploads/properties/main/filename.webp').
     * @throws \Exception If the directory cannot be created.
     */
    public function uploadFile(UploadedFile $file, string $path): string
    {
        $mimeType = $file->getClientMimeType();

        // Save directly to public/storage/ instead of storage/app/public/
        $publicStoragePath = public_path('storage');
        $destinationPath = $publicStoragePath . '/' . $path;

        // 1. Ensure destination directory exists
        if (!is_dir($destinationPath)) {
            if (!mkdir($destinationPath, 0755, true)) {
                throw new \Exception("Failed to create directory: {$destinationPath}");
            }
        }

        // 2. Handle Image Conversion (WebP)
        if (str_starts_with($mimeType, 'image/')) {
            $filename = uniqid() . '.webp';
            $fullFilePath = $destinationPath . '/' . $filename;

            // Use Intervention Image to read, encode to webp (quality 80), and save
            $image = Image::make($file->getRealPath())
                ->encode('webp', 80);
            
            // Save directly to public/storage/
            if (!file_put_contents($fullFilePath, (string) $image)) {
                throw new \Exception("Failed to save image file: {$fullFilePath}");
            }
            
            // Set proper permissions
            chmod($fullFilePath, 0644);

            // Return relative path (without public/storage prefix)
            return $path . '/' . $filename;
        }

        // 3. Handle Non-Image Files (e.g., videos)
        $filename = uniqid() . '.' . $file->extension();
        $fullFilePath = $destinationPath . '/' . $filename;
        
        // Move uploaded file directly to public/storage/
        if (!$file->move($destinationPath, $filename)) {
            throw new \Exception("Failed to move file: {$fullFilePath}");
        }
        
        // Set proper permissions
        chmod($fullFilePath, 0644);

        // Return relative path (without public/storage prefix)
        return $path . '/' . $filename;
    }

    /**
     * Handles the upload of multiple files (e.g., gallery images).
     *
     * @param array $files Array of UploadedFile instances.
     * @param string $path The public path segment.
     * @return array An array of public relative paths to the saved files.
     */
    public function uploadMultipleFiles(array $files, string $path): array
    {
        return array_map(fn(UploadedFile $file) => $this->uploadFile($file, $path), $files);
    }

    /**
     * Deletes a file from public/storage/
     *
     * @param string $filePath The relative path to the file (e.g., 'uploads/properties/main/filename.webp').
     * @return bool True if file was deleted, false otherwise.
     */
    public function deleteFile(string $filePath): bool
    {
        if (empty($filePath)) {
            return false;
        }

        $fullFilePath = public_path('storage/' . $filePath);

        if (file_exists($fullFilePath)) {
            return @unlink($fullFilePath);
        }

        return false;
    }
}
