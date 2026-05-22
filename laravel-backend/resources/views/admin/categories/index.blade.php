@extends('layouts.admin')

@section('title', 'Category Tree Management')
@section('header_title', 'Taxonomy Architect')

@section('styles')
<style>
    .cat-container {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 40px;
    }

    .cat-card {
        background-color: white;
        border: 1px solid var(--soft-grey);
        border-radius: 4px;
        padding: 30px;
        min-height: 500px;
    }

    /* Hierarchy Tree list */
    .tree-root {
        list-style: none;
        padding: 0;
    }

    .tree-item {
        margin: 10px 0;
        position: relative;
    }

    .tree-node {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border-radius: 4px;
        font-size: 14px;
        transition: all 0.2s ease;
    }

    .node-depth-0 {
        background-color: var(--charcoal);
        color: white;
        font-family: 'Outfit', sans-serif;
        font-weight: 600;
        font-size: 15px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    .node-depth-1 {
        background-color: var(--warm-ivory);
        color: var(--charcoal);
        border: 1px solid var(--soft-grey);
        margin-left: 30px;
        font-weight: 600;
    }

    .node-depth-2 {
        background-color: white;
        color: var(--dark-grey);
        border: 1px dashed var(--soft-grey);
        margin-left: 60px;
        font-size: 13px;
    }

    .node-actions {
        display: flex;
        gap: 12px;
        align-items: center;
    }

    .node-btn-delete {
        background: none;
        border: none;
        color: var(--error);
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    }

    .node-btn-delete:hover {
        opacity: 1;
    }

    /* Form stylings */
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 24px;
    }

    .form-label {
        font-size: 13px;
        font-weight: 600;
        color: var(--charcoal);
    }

    .form-input {
        padding: 12px 16px;
        border: 1px solid var(--soft-grey);
        background-color: var(--warm-ivory);
        font-size: 14px;
        border-radius: 4px;
        outline: none;
    }

    .form-input:focus {
        border-color: var(--charcoal);
        background-color: white;
    }

    .depth-badge {
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 2px;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.05em;
    }

    .depth-badge-0 { background-color: var(--clay); color: white; }
    .depth-badge-1 { background-color: #D2A395; color: white; }
    .depth-badge-2 { background-color: var(--soft-grey); color: var(--dark-grey); }

    @media (max-width: 900px) {
        .cat-container {
            grid-template-columns: 1fr;
        }
    }
</style>
@endsection

@section('content')
<div class="cat-container">
    <!-- Tree display panel -->
    <div class="cat-card">
        <div style="margin-bottom: 30px;">
            <h2 style="font-size: 18px; margin-bottom: 8px;">Active Taxonomy Tree</h2>
            <p style="color: var(--dark-grey); font-size: 14px;">Displays dynamic multi-tier classifications modeled exactly after luxury layouts.</p>
        </div>

        @if(count($categories) > 0)
            <ul class="tree-root">
                @foreach($categories as $root)
                    <li class="tree-item">
                        <div class="tree-node node-depth-0">
                            <span>🛋️ {{ $root->name }}</span>
                            <div class="node-actions">
                                <span class="depth-badge depth-badge-0">Root</span>
                                <form action="{{ route('admin.categories.destroy', $root->id) }}" method="POST" onsubmit="return confirm('WARNING: Deleting a Root category cascades deletes ALL nested sub and sub-sub categories, and all associated products! Proceed?');" style="margin:0;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="node-btn-delete" title="Purge Category">
                                        <svg fill="currentColor" width="16" height="16" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                                    </button>
                                </form>
                            </div>
                        </div>

                        <!-- Tier 2 (Sub-categories) -->
                        @if($root->children->count() > 0)
                            <ul style="list-style:none; padding:0;">
                                @foreach($root->children as $sub)
                                    <li class="tree-item">
                                        <div class="tree-node node-depth-1">
                                            <span>📂 {{ $sub->name }}</span>
                                            <div class="node-actions">
                                                <span class="depth-badge depth-badge-1">Sub-Category</span>
                                                <form action="{{ route('admin.categories.destroy', $sub->id) }}" method="POST" onsubmit="return confirm('Confirm deleting Sub-Category and all sub-sub children items?');" style="margin:0;">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="node-btn-delete">
                                                        <svg fill="currentColor" width="15" height="15" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                                                    </button>
                                                </form>
                                            </div>
                                        </div>

                                        <!-- Tier 3 (Sub-sub-categories) -->
                                        @if($sub->children->count() > 0)
                                            <ul style="list-style:none; padding:0;">
                                                @foreach($sub->children as $subSub)
                                                    <li class="tree-item">
                                                        <div class="tree-node node-depth-2">
                                                            <span>🏷️ {{ $subSub->name }}</span>
                                                            <div class="node-actions">
                                                                <span class="depth-badge depth-badge-2">Sub-Sub-Category</span>
                                                                <form action="{{ route('admin.categories.destroy', $subSub->id) }}" method="POST" onsubmit="return confirm('Confirm deleting Sub-Sub-Category?');" style="margin:0;">
                                                                    @csrf
                                                                    @method('DELETE')
                                                                    <button type="submit" class="node-btn-delete">
                                                                        <svg fill="currentColor" width="14" height="14" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                                                                    </button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </li>
                                                @endforeach
                                            </ul>
                                        @endif
                                    </li>
                                @endforeach
                            </ul>
                        @endif
                    </li>
                @endforeach
            </ul>
        @else
            <div style="text-align: center; padding: 60px 20px; color: var(--dark-grey);">
                <p>No categories established yet. Fill out the builder on the right to start!</p>
            </div>
        @endif
    </div>

    <!-- Addition Form Builder -->
    <div class="cat-card" style="min-height: auto;">
        <div style="margin-bottom: 24px; border-bottom: 1px solid var(--soft-grey); padding-bottom: 14px;">
            <h2 style="font-size: 18px; margin-bottom: 4px;">Inject Category</h2>
            <p style="color: var(--dark-grey); font-size: 13px;">Add elements into the hierarchical tree model.</p>
        </div>

        <form action="{{ route('admin.categories.store') }}" method="POST">
            @csrf
            
            <div class="form-group">
                <label class="form-label" for="name">Category Name *</label>
                <input class="form-input" type="text" id="name" name="name" placeholder="e.g. Dining Tables" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="parent_id">Attach to Parent (Optional)</label>
                <select class="form-input" id="parent_id" name="parent_id">
                    <option value="">-- None (Creates a Root category) --</option>
                    @foreach($parentCandidates as $candidate)
                        <option value="{{ $candidate->id }}">
                            @if($candidate->depth == 1) &nbsp;&nbsp;&nbsp;&nbsp; @endif
                            {{ $candidate->name }} (Tier {{ $candidate->depth + 1 }})
                        </option>
                    @endforeach
                </select>
                <span style="font-size: 11px; color: var(--dark-grey); margin-top: 4px;">Select parent to nested. Roots have Tier 1 depth, subs are Tier 2, and sub-subs are Tier 3. Limit depth bounds strictly at Tier 3.</span>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">Build Category Item</button>
        </form>
    </div>
</div>
@endsection
