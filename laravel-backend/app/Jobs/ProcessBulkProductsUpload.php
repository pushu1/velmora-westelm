<?php

namespace App\Jobs;

use App\Imports\ProductsImport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class ProcessBulkProductsUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $filePath;
    protected string $jobBatchToken;

    /**
     * Create a new job instance.
     */
    public function __construct(string $filePath, string $jobBatchToken)
    {
        $this->filePath = $filePath;
        $this->jobBatchToken = $jobBatchToken;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Asynchronous Excel Product upload job started for Batch Token: {$this->jobBatchToken}");

        try {
            $import = new ProductsImport();
            
            // Execute Maatwebsite import synchronously inside this background worker
            Excel::import($import, $this->filePath, 'public');

            $summary = [
                'status' => 'completed',
                'processed' => $import->getProcessedCount(),
                'failed' => $import->getFailedCount(),
                'errors' => $import->getErrorsLog(),
                'completed_at' => now()->toDateTimeString(),
            ];

            // Store summary in cache for 24 hours so Admin UI can pull it
            Cache::put("excel_import_{$this->jobBatchToken}", $summary, now()->addDays(1));

            Log::info("Asynchronous Excel Product upload job completed. Processed: {$summary['processed']}, Failed: {$summary['failed']}");

        } catch (\Exception $e) {
            $summary = [
                'status' => 'failed',
                'processed' => 0,
                'failed' => 0,
                'errors' => [$e->getMessage()],
                'completed_at' => now()->toDateTimeString(),
            ];

            Cache::put("excel_import_{$this->jobBatchToken}", $summary, now()->addDays(1));
            Log::error("Asynchronous Excel Product upload job failed: " . $e->getMessage());
        }
    }
}
