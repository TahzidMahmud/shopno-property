<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Intervention\Image\Facades\Image; // Requires composer require intervention/image
use Illuminate\Support\Facades\File;

class FileUploadService
{
    /**
     * Handles the upload and conversion of a single file to WebP (if an image).
     *
     * @param UploadedFile $file The uploaded file instance.
     * @param string $path The public path segment (e.g., 'uploads/properties/main').
     * @return string The public relative path to the saved file.
     * @throws \Exception If the directory cannot be created.
     */
    public function uploadFile(UploadedFile $file, string $path): string
    {
        $mimeType = $file->getClientMimeType();
        $basePath = public_path($path);

        // 1. Ensure destination directory exists
        if (!File::isDirectory($basePath)) {
            if (!File::makeDirectory($basePath, 0755, true)) {
                throw new \Exception("Could not create directory: {$basePath}");
            }
        }

        // 2. Handle Image Conversion (WebP)
        if (str_starts_with($mimeType, 'image/')) {
            $filename = uniqid() . '.webp';
            $fullDestinationPath = $basePath . '/' . $filename;

            // Use Intervention Image to read, encode to webp (quality 80), and save
            Image::make($file->getRealPath())
                ->encode('webp', 80)
                ->save($fullDestinationPath);

            return $path . '/' . $filename;
        }

        // 3. Handle Non-Image Files (e.g., videos)
        $filename = uniqid() . '.' . $file->extension();
        $file->move($basePath, $filename);

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
}
