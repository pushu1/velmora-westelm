@extends('layouts.admin')

@section('title', 'Add Luxury Catalog Product')
@section('header_title', 'Injection Engine')

@section('styles')
<style>
    .form-container {
        background-color: white;
        border: 1px solid var(--soft-grey);
        border-radius: 4px;
        padding: 40px;
    }

    .form-section-title {
        font-size: 16px;
        text-transform: uppercase;
        color: var(--clay);
        letter-spacing: 0.05em;
        margin-bottom: 24px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--warm-ivory);
        font-weight: 600;
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
        margin-bottom: 40px;
    }

    .form-grid-full {
        grid-column: span 2;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .form-label {
        font-size: 13px;
        font-weight: 600;
        color: var(--charcoal);
        letter-spacing: 0.02em;
    }

    .form-input {
        padding: 12px 16px;
        border: 1px solid var(--soft-grey);
        background-color: var(--warm-ivory);
        color: var(--charcoal);
        font-size: 14px;
        border-radius: 4px;
        outline: none;
        transition: border-color 0.2s ease;
    }

    .form-input:focus {
        border-color: var(--charcoal);
        background-color: white;
    }

    .form-textarea {
        resize: vertical;
        min-height: 120px;
    }

    /* Multi-Image Drag-and-drop zone */
    .dropzone-container {
        border: 2px dashed #CCCCCC;
        background-color: var(--warm-ivory);
        border-radius: 4px;
        padding: 40px 20px;
        text-align: center;
        cursor: pointer;
        position: relative;
        transition: all 0.2s ease;
    }

    .dropzone-container:hover, .dropzone-container.dragover {
        border-color: var(--clay);
        background-color: rgba(192, 122, 101, 0.03);
    }

    .dropzone-icon {
        margin-bottom: 16px;
        color: var(--dark-grey);
    }

    .dropzone-text {
        font-size: 14px;
        color: var(--dark-grey);
        margin-bottom: 8px;
    }

    .dropzone-subtext {
        font-size: 12px;
        color: #999999;
    }

    .file-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    .selected-files-list {
        margin-top: 20px;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .selected-file-item {
        background-color: white;
        border: 1px solid var(--soft-grey);
        padding: 10px 16px;
        border-radius: 4px;
        font-size: 13px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* SEO meters styling */
    .seo-counter {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        margin-top: 4px;
        color: var(--dark-grey);
    }

    .seo-counter.limit-exceeded {
        color: var(--error);
        font-weight: 600;
    }

    .form-errors-banner {
        background-color: rgba(188, 71, 71, 0.04);
        border-left: 4px solid var(--error);
        padding: 20px;
        margin-bottom: 30px;
        border-radius: 0 4px 4px 0;
    }

    .form-errors-list {
        list-style: none;
        font-size: 13px;
        color: var(--error);
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    @media (max-width: 800px) {
        .form-grid {
            grid-template-columns: 1fr;
        }
        .form-grid-full {
            grid-column: span 1;
        }
    }
</style>
@endsection

@section('content')
<div class="form-container">
    <div style="margin-bottom: 30px;">
        <h2 style="font-size: 20px; margin-bottom: 8px;">Create Catalog Entry</h2>
        <p style="color: var(--dark-grey); font-size: 14px;">Establish unique pricing, multi-image assets, taxonomies, and SEO visibility attributes.</p>
    </div>

    <!-- Error Banner -->
    @if ($errors->any())
        <div class="form-errors-banner">
            <ul class="form-errors-list">
                @foreach ($errors->all() as $error)
                    <li>• {{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('admin.products.store') }}" method="POST" enctype="multipart/form-data">
        @csrf

        <!-- SECTION 1: CORE SPECIFICATIONS -->
        <h3 class="form-section-title">Core Specifications</h3>
        <div class="form-grid">
            <div class="form-group">
                <label class="form-label" for="title">Product Name *</label>
                <input class="form-input" type="text" id="title" name="title" value="{{ old('title') }}" placeholder="e.g. Soras Fabric Loveseat" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="category_id">Sub-Sub-Category Classification *</label>
                <select class="form-input" id="category_id" name="category_id" required>
                    <option value="">-- Choose Category --</option>
                    @foreach($categories as $category)
                        <option value="{{ $category->id }}" {{ old('category_id') == $category->id ? 'selected' : '' }}>
                            {{ $category->name }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label class="form-label" for="sku">SKU Code (Unique Identifiers) *</label>
                <input class="form-input" type="text" id="sku" name="sku" value="{{ old('sku') }}" placeholder="e.g. WE-SF-SL-001" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="inventory">Stock Inventory Levels *</label>
                <input class="form-input" type="number" id="inventory" name="inventory" value="{{ old('inventory', 0) }}" min="0" required>
            </div>

            <div class="form-grid-full form-group">
                <label class="form-label" for="short_description">Short Summary Description *</label>
                <input class="form-input" type="text" id="short_description" name="short_description" value="{{ old('short_description') }}" placeholder="Brief luxury editorial overview..." required>
            </div>

            <div class="form-grid-full form-group">
                <label class="form-label" for="long_description">Long Editorial Narrative *</label>
                <textarea class="form-input form-textarea" id="long_description" name="long_description" placeholder="Fully detailed specifications, structural materials, wood elements, finishes..." required>{{ old('long_description') }}</textarea>
            </div>
        </div>

        <!-- SECTION 2: ATTRIBUTES & PRICING -->
        <h3 class="form-section-title">Pricing & Physical Attributes</h3>
        <div class="form-grid">
            <div class="form-group">
                <label class="form-label" for="base_price">Base Retail Price (₹) *</label>
                <input class="form-input" type="number" step="0.01" id="base_price" name="base_price" value="{{ old('base_price') }}" placeholder="₹99,999.00" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="discount_price">Markdown Price (₹) (Optional - strictly less than base price)</label>
                <input class="form-input" type="number" step="0.01" id="discount_price" name="discount_price" value="{{ old('discount_price') }}" placeholder="₹89,999.00">
            </div>

            <div class="form-group">
                <label class="form-label" for="dimensions">Dimensions *</label>
                <input class="form-input" type="text" id="dimensions" name="dimensions" value="{{ old('dimensions') }}" placeholder="e.g. 68”w x 38”d x 33”h" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="care_instructions">Care Instructions *</label>
                <input class="form-input" type="text" id="care_instructions" name="care_instructions" value="{{ old('care_instructions') }}" placeholder="e.g. Wipe clean with soft damp cloth." required>
            </div>
        </div>

        <!-- SECTION 3: MULTI-IMAGE BATCH ENGINE -->
        <h3 class="form-section-title">Catalog Photography Uploads</h3>
        <div class="form-grid form-grid-full" style="margin-bottom: 40px;">
            <div class="form-group">
                <label class="form-label">Upload Concurrent High-Res Media (At least 1 required, supports 5+ images)</label>
                <div class="dropzone-container" id="dropzone">
                    <div class="dropzone-icon">
                        <svg fill="none" stroke="currentColor" width="48" height="48" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <div class="dropzone-text">Drag and drop high-res images here, or click to browse</div>
                    <div class="dropzone-subtext">JPG, PNG, JPEG, or WEBP. Max 10MB per file. Up to 10 files.</div>
                    <input class="file-input" type="file" id="images" name="images[]" multiple required>
                </div>
                <div class="selected-files-list" id="selected-files"></div>
            </div>
        </div>

        <!-- SECTION 4: SEO METADATA CONTROLS -->
        <h3 class="form-section-title">Search Engine Optimization (SEO)</h3>
        <div class="form-grid">
            <div class="form-group">
                <label class="form-label" for="meta_title">Index Meta Title</label>
                <input class="form-input" type="text" id="meta_title" name="meta_title" value="{{ old('meta_title') }}" placeholder="Luxury Loveseats | West Elm India" maxlength="100">
                <div class="seo-counter" id="meta-title-counter">
                    <span>Target: max 60 characters for standard visibility.</span>
                    <span class="count-val">0 / 60</span>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label" for="meta_description">Snippet Meta Description</label>
                <input class="form-input" type="text" id="meta_description" name="meta_description" value="{{ old('meta_description') }}" placeholder="Shop Soras Fabric Loveseats. Elegant curves meet deep seat comfort..." maxlength="200">
                <div class="seo-counter" id="meta-description-counter">
                    <span>Target: max 160 characters for search listings snippets.</span>
                    <span class="count-val">0 / 160</span>
                </div>
            </div>
        </div>

        <!-- SUBMIT BLOCK -->
        <div style="display: flex; gap: 20px; justify-content: flex-end; padding-top: 30px; border-top: 1px solid var(--soft-grey);">
            <a href="{{ route('admin.products.index') }}" class="btn btn-outline">Cancel</a>
            <button type="submit" class="btn btn-primary">Inject Catalog Product</button>
        </div>
    </form>
</div>
@endsection

@section('scripts')
<script>
    document.addEventListener("DOMContentLoaded", function() {
        // Multi-image selection list viewer
        const fileInput = document.querySelector("#images");
        const dropzone = document.querySelector("#dropzone");
        const fileList = document.querySelector("#selected-files");

        fileInput.addEventListener("change", function(e) {
            fileList.innerHTML = '';
            const files = e.target.files;
            
            if(files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const sizeMB = (files[i].size / (1024 * 1024)).toFixed(2);
                    const item = document.createElement("div");
                    item.className = "selected-file-item";
                    item.innerHTML = `
                        <strong>📸 ${files[i].name}</strong>
                        <span style="color: var(--dark-grey);">${sizeMB} MB</span>
                    `;
                    fileList.appendChild(item);
                }
            }
        });

        // Dropzone active states
        fileInput.addEventListener("dragenter", () => dropzone.classList.add("dragover"));
        fileInput.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
        fileInput.addEventListener("drop", () => dropzone.classList.remove("dragover"));

        // SEO Index fields real-time length countdown
        const metaTitle = document.querySelector("#meta_title");
        const titleCounter = document.querySelector("#meta-title-counter");
        const titleCountVal = titleCounter.querySelector(".count-val");

        const metaDesc = document.querySelector("#meta_description");
        const descCounter = document.querySelector("#meta-description-counter");
        const descCountVal = descCounter.querySelector(".count-val");

        function updateCounter(input, counterEl, countValEl, limit) {
            const length = input.value.length;
            countValEl.textContent = `${length} / ${limit}`;
            
            if (length > limit) {
                counterEl.classList.add("limit-exceeded");
            } else {
                counterEl.classList.remove("limit-exceeded");
            }
        }

        metaTitle.addEventListener("input", () => updateCounter(metaTitle, titleCounter, titleCountVal, 60));
        metaDesc.addEventListener("input", () => updateCounter(metaDesc, descCounter, descCountVal, 160));

        // Trigger counts on initial values
        updateCounter(metaTitle, titleCounter, titleCountVal, 60);
        updateCounter(metaDesc, descCounter, descCountVal, 160);
    });
</script>
@endsection
