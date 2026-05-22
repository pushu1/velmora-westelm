<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories and creation dashboard.
     */
    public function index()
    {
        // Load Root tiers with children hierarchies
        $categories = Category::with('children.children')
            ->whereNull('parent_id')
            ->orderBy('name', 'asc')
            ->get();

        // Get potential parents for category creations (tiers 0 and 1)
        $parentCandidates = Category::whereIn('depth', [0, 1])
            ->orderBy('depth', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return view('admin.categories.index', compact('categories', 'parentCandidates'));
    }

    /**
     * API endpoint to get all categories for Next.js select component.
     * GET /api/categories
     */
    public function apiIndex()
    {
        $categories = Category::orderBy('name', 'asc')->get();
        return response()->json([
            'success' => true,
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|integer|exists:categories,id',
        ]);

        $depth = 0;
        if ($request->parent_id) {
            $parent = Category::findOrFail($request->parent_id);
            // Depth increases by 1 relative to parent
            $depth = $parent->depth + 1;

            if ($depth > 2) {
                return redirect()
                    ->back()
                    ->withInput()
                    ->with('error', 'Hierarchy limit exceeded. You cannot add categories beyond the 3rd tier (sub-sub-category).');
            }
        }

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'parent_id' => $request->parent_id,
            'depth' => $depth,
        ]);

        return redirect()
            ->route('admin.categories.index')
            ->with('success', "Category '{$category->name}' was added successfully at tier depth {$category->depth}.");
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Category $category)
    {
        // On delete cascade is database level, so deleting will cascade through Eloquent
        $category->delete();

        return redirect()
            ->route('admin.categories.index')
            ->with('success', "Category and all its nested sub-categories were successfully deleted.");
    }

    /**
     * API endpoint to get category tree and parent candidates.
     * GET /api/admin/categories
     */
    public function apiAdminIndex()
    {
        $categories = Category::with('children.children')
            ->whereNull('parent_id')
            ->orderBy('name', 'asc')
            ->get();

        $parentCandidates = Category::whereIn('depth', [0, 1])
            ->orderBy('depth', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'categories' => $categories,
            'parentCandidates' => $parentCandidates
        ]);
    }

    /**
     * API endpoint to store a newly created category.
     * POST /api/admin/categories
     */
    public function apiStore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|integer|exists:categories,id',
        ]);

        $depth = 0;
        if ($request->parent_id) {
            $parent = Category::findOrFail($request->parent_id);
            $depth = $parent->depth + 1;

            if ($depth > 2) {
                return response()->json([
                    'success' => false,
                    'message' => 'Hierarchy limit exceeded. You cannot add categories beyond the 3rd tier (sub-sub-category).'
                ], 422);
            }
        }

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'parent_id' => $request->parent_id,
            'depth' => $depth,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Category '{$category->name}' was added successfully.",
            'category' => $category
        ], 201);
    }

    /**
     * API endpoint to remove the specified category.
     * DELETE /api/admin/categories/{category}
     */
    public function apiDestroy(Category $category)
    {
        $category->delete();
        return response()->json([
            'success' => true,
            'message' => "Category and all its nested sub-categories were successfully deleted."
        ]);
    }
}
