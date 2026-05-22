@extends('layouts.admin')

@section('title', 'Bulk Spreadsheet Ingestion')
@section('header_title', 'Data Auditing Pipeline')

@section('styles')
<style>
    .excel-container {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 40px;
    }

    .excel-card {
        background-color: white;
        border: 1px solid var(--soft-grey);
        border-radius: 4px;
        padding: 40px;
    }

    /* Selection drag zone */
    .file-dropzone {
        border: 2px dashed #CCCCCC;
        background-color: var(--warm-ivory);
        padding: 60px 20px;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        transition: all 0.2s ease;
        margin-bottom: 24px;
    }

    .file-dropzone:hover, .file-dropzone.dragover {
        border-color: var(--clay);
        background-color: rgba(192, 122, 101, 0.02);
    }

    .file-dropzone svg {
        color: var(--dark-grey);
        margin-bottom: 16px;
    }

    .dropzone-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    /* Polling stats block */
    .polling-panel {
        background-color: var(--charcoal);
        color: white;
        padding: 30px;
        border-radius: 4px;
        display: none;
        margin-bottom: 30px;
    }

    .progress-bar-container {
        height: 6px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
        margin: 20px 0;
        position: relative;
    }

    .progress-bar-fill {
        height: 100%;
        width: 0%;
        background-color: var(--clay);
        transition: width 0.4s ease;
    }

    .polling-stats {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        margin-bottom: 16px;
    }

    .status-badge {
        display: inline-block;
        padding: 4px 10px;
        font-size: 11px;
        text-transform: uppercase;
        font-weight: 600;
        border-radius: 20px;
        background-color: var(--clay);
    }

    .logs-box {
        background-color: var(--off-black);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        padding: 16px;
        font-family: monospace;
        font-size: 12px;
        color: #A8C3B8;
        max-height: 200px;
        overflow-y: auto;
        white-space: pre-wrap;
    }

    .specification-item {
        margin-bottom: 16px;
        font-size: 13px;
    }
    
    .specification-item strong {
        color: var(--charcoal);
        display: block;
        margin-bottom: 4px;
    }

    .specification-item span {
        color: var(--dark-grey);
    }
</style>
@endsection

@section('content')
<div class="excel-container">
    
    <!-- Left panel upload zone -->
    <div class="excel-card">
        <div style="margin-bottom: 30px;">
            <h2 style="font-size: 20px; margin-bottom: 8px;">Upload Catalog Spreadsheet</h2>
            <p style="color: var(--dark-grey); font-size: 14px;">Ingest product list catalogs in bulk. Existing SKUs are stock updated; new items are added to systems.</p>
        </div>

        <!-- Polling System Progress Overlay -->
        <div class="polling-panel" id="progress-panel">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="font-size: 15px; color: var(--warm-ivory);">Queued Background Parser</h3>
                <span class="status-badge" id="job-status">Processing</span>
            </div>
            
            <div class="progress-bar-container">
                <div class="progress-bar-fill" id="job-progress-fill"></div>
            </div>

            <div class="polling-stats">
                <div>Processed Rows: <strong id="processed-count" style="color: white;">0</strong></div>
                <div>Failed Rows: <strong id="failed-count" style="color: var(--error);">0</strong></div>
            </div>

            <div style="font-size: 12px; margin-bottom: 10px; color: rgba(255, 255, 255, 0.6);">Parsing Event Log:</div>
            <div class="logs-box" id="job-logs">Starting asynchronous row audit scans...</div>
        </div>

        <!-- File selection dropzone -->
        <form action="{{ route('admin.excel.store') }}" method="POST" enctype="multipart/form-data" id="upload-form">
            @csrf
            
            <div class="file-dropzone" id="dropzone">
                <svg fill="none" stroke="currentColor" width="48" height="48" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <div style="font-size: 15px; font-weight: 600; color: var(--charcoal); margin-bottom: 8px;">Select Catalog Sheet</div>
                <div style="font-size: 13px; color: var(--dark-grey); margin-bottom: 4px;">Drag and drop .xlsx or .csv here, or click to browse</div>
                <div style="font-size: 11px; color: #999999;">Supported formats: XLSX, CSV, XLS. Max file size: 20MB.</div>
                <input class="dropzone-input" type="file" name="excel_file" id="excel_file" required>
            </div>

            <div style="text-align: right;">
                <button type="submit" class="btn btn-primary" id="btn-submit">Process Catalog Import</button>
            </div>
        </form>
    </div>

    <!-- Right specifications documentation -->
    <div class="excel-card" style="min-height: auto;">
        <div style="margin-bottom: 24px; border-bottom: 1px solid var(--soft-grey); padding-bottom: 14px;">
            <h3 style="font-size: 16px; color: var(--clay);">CSV Columns Mapping</h3>
        </div>

        <div class="specification-item">
            <strong>sku *</strong>
            <span>Unique inventory SKU code (e.g. WE-SF-SL-001)</span>
        </div>

        <div class="specification-item">
            <strong>title *</strong>
            <span>Product editorial catalog title (e.g. Soras Loveseat)</span>
        </div>

        <div class="specification-item">
            <strong>category_id *</strong>
            <span>Numeric ID of sub-sub-category (from Category Tree panel)</span>
        </div>

        <div class="specification-item">
            <strong>base_price *</strong>
            <span>Numeric decimal cost (e.g. 89999.00)</span>
        </div>

        <div class="specification-item">
            <strong>discount_price</strong>
            <span>Optional cost value strictly less than base price</span>
        </div>

        <div class="specification-item">
            <strong>inventory *</strong>
            <span>Available inventory count. Increments stock values if SKU duplicates.</span>
        </div>

        <div class="specification-item">
            <strong>dimensions & care_instructions</strong>
            <span>Details on sizes (e.g. 68”w x 38”d x 33”h) and clean cares.</span>
        </div>

        <div class="specification-item">
            <strong>meta_title & meta_description</strong>
            <span>Google indexing metadata SEO parameters inputs.</span>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
    document.addEventListener("DOMContentLoaded", function() {
        const dropzone = document.querySelector("#dropzone");
        const fileInput = document.querySelector("#excel_file");
        const uploadForm = document.querySelector("#upload-form");
        const btnSubmit = document.querySelector("#btn-submit");
        
        fileInput.addEventListener("change", function(e) {
            if(e.target.files.length > 0) {
                dropzone.querySelector("div").textContent = "Selected: " + e.target.files[0].name;
                dropzone.style.borderColor = "var(--clay)";
            }
        });

        fileInput.addEventListener("dragenter", () => dropzone.classList.add("dragover"));
        fileInput.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
        fileInput.addEventListener("drop", () => dropzone.classList.remove("dragover"));

        // Retrieve batch token if redirected back from submitting sheet
        @if(session('batch_token'))
            const batchToken = "{{ session('batch_token') }}";
            startPolling(batchToken);
        @endif

        function startPolling(token) {
            const panel = document.querySelector("#progress-panel");
            const fill = document.querySelector("#job-progress-fill");
            const statusBadge = document.querySelector("#job-status");
            const procCount = document.querySelector("#processed-count");
            const failCount = document.querySelector("#failed-count");
            const logs = document.querySelector("#job-logs");

            panel.style.display = "block";
            fill.style.width = "10%";
            logs.textContent = "Checking background batch token: " + token + "...\n";

            // Set up polling interval every 2.5 seconds
            const interval = setInterval(function() {
                fetch('/admin/excel/status/' + token)
                    .then(response => response.json())
                    .then(data => {
                        procCount.textContent = data.processed;
                        failCount.textContent = data.failed;
                        
                        if(data.status === 'pending') {
                            statusBadge.textContent = "Processing";
                            statusBadge.style.backgroundColor = "var(--clay)";
                            fill.style.width = "40%";
                            logs.textContent += "Job queued... scanning spreadsheet lines...\n";
                        } else if(data.status === 'completed') {
                            clearInterval(interval);
                            statusBadge.textContent = "Success";
                            statusBadge.style.backgroundColor = "var(--success)";
                            fill.style.width = "100%";
                            
                            let summary = "Ingestion Complete!\n";
                            summary += `✔ Processed: ${data.processed} rows.\n`;
                            summary += `✖ Failed: ${data.failed} rows.\n`;
                            if(data.errors.length > 0) {
                                summary += "\nErrors Log:\n";
                                data.errors.forEach(err => {
                                    summary += `• ${err}\n`;
                                });
                            }
                            logs.textContent = summary;
                        } else if(data.status === 'failed') {
                            clearInterval(interval);
                            statusBadge.textContent = "Failed";
                            statusBadge.style.backgroundColor = "var(--error)";
                            fill.style.width = "100%";
                            logs.textContent = "Background job failed!\n" + data.errors.join("\n");
                        }
                        
                        // Auto-scroll logs box to bottom
                        logs.scrollTop = logs.scrollHeight;
                    })
                    .catch(err => {
                        clearInterval(interval);
                        logs.textContent += "Network error checking job status: " + err.message;
                    });
            }, 2500);
        }
    });
</script>
@endsection
