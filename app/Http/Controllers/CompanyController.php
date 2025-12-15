<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $companies = Company::orderBy('name')->get();
        return response()->json($companies, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'owner_name' => 'required|string|max:255',
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $validated['logo'] = $this->fileUploadService->uploadFile(
                $request->file('logo'),
                'uploads/companies'
            );
        }

        $company = Company::create($validated);

        return response()->json([
            'message' => 'Company created successfully',
            'data' => $company
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $company = Company::findOrFail($id);
        return response()->json($company, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $company = Company::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'owner_name' => 'required|string|max:255',
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($company->logo) {
                $this->fileUploadService->deleteFile($company->logo);
            }
            // Upload new logo
            $validated['logo'] = $this->fileUploadService->uploadFile(
                $request->file('logo'),
                'uploads/companies'
            );
        }

        $company->update($validated);

        return response()->json([
            'message' => 'Company updated successfully',
            'data' => $company
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $company = Company::findOrFail($id);
        
        // Delete logo file if exists
        if ($company->logo) {
            $this->fileUploadService->deleteFile($company->logo);
        }
        
        $company->delete();

        return response()->json(['message' => 'Company deleted successfully'], 200);
    }
}
