<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Furniture Hierarchy
        $furniture = Category::create([
            'name' => 'Furniture',
            'slug' => 'furniture',
            'parent_id' => null,
            'depth' => 0,
        ]);

        $livingRoom = Category::create([
            'name' => 'Living Room Furniture',
            'slug' => 'living-room-furniture',
            'parent_id' => $furniture->id,
            'depth' => 1,
        ]);

        $sofas = Category::create([
            'name' => 'Sofas & Sectionals',
            'slug' => 'sofas-and-sectionals',
            'parent_id' => $livingRoom->id,
            'depth' => 2,
        ]);

        // 2. Bedding Hierarchy
        $bedding = Category::create([
            'name' => 'Bedding',
            'slug' => 'bedding',
            'parent_id' => null,
            'depth' => 0,
        ]);

        $sheets = Category::create([
            'name' => 'Sheets & Bed Sets',
            'slug' => 'sheets-and-bed-sets',
            'parent_id' => $bedding->id,
            'depth' => 1,
        ]);

        $linenSheets = Category::create([
            'name' => 'Linen Sheet Sets',
            'slug' => 'linen-sheet-sets',
            'parent_id' => $sheets->id,
            'depth' => 2,
        ]);

        // 3. Bath Hierarchy
        $bath = Category::create([
            'name' => 'Bath',
            'slug' => 'bath',
            'parent_id' => null,
            'depth' => 0,
        ]);

        $bathAccessories = Category::create([
            'name' => 'Bathroom Accessories',
            'slug' => 'bathroom-accessories',
            'parent_id' => $bath->id,
            'depth' => 1,
        ]);

        $vanityTrays = Category::create([
            'name' => 'Vanity Trays',
            'slug' => 'vanity-trays',
            'parent_id' => $bathAccessories->id,
            'depth' => 2,
        ]);
    }
}
