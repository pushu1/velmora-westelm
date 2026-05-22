<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessBulkProductsUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class ExcelIngestionController extends Controller
{
    /**
     * Display the Excel/CSV ingestion zone.
     */
    public function index()
    {
        return view('admin.excel.index');
    }

    /**
     * Upload spreadsheet and dispatch background parsing task.
     */
    public function store(Request $request)
    {
        $request->validate([
            'excel_file' => 'required|file|mimes:xlsx,csv,xls|max:20480', // max 20MB
        ]);

        $file = $request->file('excel_file');
        $extension = $file->getClientOriginalExtension();
        
        // Generate unique token to identify this specific import session
        $batchToken = 'batch_' . Str::random(10) . '_' . time();
        $filename = "import_{$batchToken}.{$extension}";

        // Save spreadsheet inside private/imports folder
        $path = $file->storeAs('imports', $filename, 'public');

        // Create initial job trace structure in Cache
        Cache::put("excel_import_{$batchToken}", [
            'status' => 'pending',
            'processed' => 0,
            'failed' => 0,
            'errors' => [],
            'completed_at' => null,
        ], now()->addDays(1));

        // Dispatch background processing job
        ProcessBulkProductsUpload::dispatch(Storage_path('app/public/' . $path), $batchToken);

        return redirect()
            ->route('admin.excel.index')
            ->with('success', 'Spreadsheet uploaded successfully! Ingestion processing is running in the background.')
            ->with('batch_token', $batchToken);
    }

    /**
     * Ajax tracking endpoint checking active job status trace.
     */
    public function checkStatus($batchToken)
    {
        $data = Cache::get("excel_import_{$batchToken}");

        if (!$data) {
            return response()->json([
                'status' => 'unknown',
                'message' => 'Invalid or expired batch token.',
            ], 404);
        }

        return response()->json($data);
    }

    /**
     * API endpoint to upload spreadsheet and dispatch background parsing task.
     * POST /api/admin/bulk-upload
     */
    public function apiStore(Request $request)
    {
        $request->validate([
            'excel_file' => 'required|file|mimes:xlsx,csv,xls|max:20480', // max 20MB
        ]);

        $file = $request->file('excel_file');
        $extension = $file->getClientOriginalExtension();
        
        // Generate unique token to identify this specific import session
        $batchToken = 'batch_' . Str::random(10) . '_' . time();
        $filename = "import_{$batchToken}.{$extension}";

        // Save spreadsheet inside public/imports folder
        $path = $file->storeAs('imports', $filename, 'public');

        // Create initial job trace structure in Cache
        Cache::put("excel_import_{$batchToken}", [
            'status' => 'pending',
            'processed' => 0,
            'failed' => 0,
            'errors' => [],
            'completed_at' => null,
        ], now()->addDays(1));

        // Dispatch background processing job
        ProcessBulkProductsUpload::dispatch(storage_path('app/public/' . $path), $batchToken);

        return response()->json([
            'success' => true,
            'message' => 'Spreadsheet uploaded successfully! Ingestion processing is running in the background.',
            'batch_token' => $batchToken
        ]);
    }

    /**
     * API tracking endpoint checking active job status trace.
     * GET /api/admin/bulk-upload/status/{token}
     */
    public function apiCheckStatus($batchToken)
    {
        $data = Cache::get("excel_import_{$batchToken}");

        if (!$data) {
            return response()->json([
                'status' => 'unknown',
                'message' => 'Invalid or expired batch token.',
            ], 404);
        }

        return response()->json($data);
    }
}
