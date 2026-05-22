<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Category;

class NavigationController extends Controller
{
    /**
     * Eager load the category taxonomy tree and return a structural JSON menu feed
     * or bind directly into a master layout container.
     */
    public function getHeaderNavigation()
    {
        // Eager loads: 1. Roots (parent_id is null) -> 2. Sub-categories -> 3. Sub-sub-categories
        $navigationTree = Category::with(['children.children' => function ($query) {
            $query->orderBy('name', 'asc');
        }])
        ->whereNull('parent_id')
        ->orderBy('name', 'asc')
        ->get();

        return response()->json($navigationTree);
    }
}
