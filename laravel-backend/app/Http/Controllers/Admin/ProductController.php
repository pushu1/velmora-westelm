<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductStoreRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index()
    {
        $products = Product::with(['category', 'images'])->orderBy('created_at', 'desc')->paginate(15);
        return view('admin.products.index', compact('products'));
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        // Load only the fine-grain sub-sub-categories (depth = 2) for direct product association
        $categories = Category::where('depth', 2)->orderBy('name', 'asc')->get();
        return view('admin.products.create', compact('categories'));
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(ProductStoreRequest $request)
    {
        DB::beginTransaction();

        try {
            // Create the Product instance
            $product = Product::create([
                'category_id' => $request->category_id,
                'title' => $request->title,
                'slug' => Str::slug($request->title),
                'short_description' => $request->short_description,
                'long_description' => $request->long_description,
                'dimensions' => $request->dimensions,
                'care_instructions' => $request->care_instructions,
                'base_price' => $request->base_price,
                'discount_price' => $request->discount_price,
                'sku' => $request->sku,
                'inventory' => $request->inventory,
                'meta_title' => $request->meta_title,
                'meta_description' => $request->meta_description,
            ]);

            // Process uploaded product image array files
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    // Generate clean dynamic timestamp naming structure
                    $timestamp = time() . '_' . $index . '_' . uniqid();
                    $extension = $image->getClientOriginalExtension();
                    $filename = "prod_{$timestamp}.{$extension}";

                    // Store inside storage/app/public/products
                    $path = $image->storeAs('products', $filename, 'public');

                    // Save record connection
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $path,
                        'sort_order' => $index,
                    ]);
                }
            }

            DB::commit();

            return redirect()
                ->route('admin.products.index')
                ->with('success', "Product '{$product->title}' has been successfully created with SKU: {$product->sku}.");

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'An error occurred while creating product: ' . $e->getMessage());
        }
    }

    /**
     * API endpoint to store a newly created product via multipart/form-data.
     * POST /api/admin/products
     */
    public function apiStore(ProductStoreRequest $request)
    {
        DB::beginTransaction();

        try {
            // Create the Product instance
            $product = Product::create([
                'category_id' => $request->category_id,
                'title' => $request->title,
                'slug' => Str::slug($request->title) . '-' . Str::random(4),
                'short_description' => $request->short_description,
                'long_description' => $request->long_description,
                'dimensions' => $request->dimensions,
                'care_instructions' => $request->care_instructions,
                'base_price' => $request->base_price,
                'discount_price' => $request->discount_price ?: null,
                'sku' => strtoupper($request->sku),
                'inventory' => intval($request->inventory),
                'meta_title' => $request->meta_title ?: null,
                'meta_description' => $request->meta_description ?: null,
            ]);

            $imagePaths = [];
            // Process uploaded product image array files
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    // Generate clean dynamic timestamp naming structure
                    $timestamp = time() . '_' . $index . '_' . uniqid();
                    $extension = $image->getClientOriginalExtension();
                    $filename = "prod_{$timestamp}.{$extension}";

                    // Store inside storage/app/public/products
                    $path = $image->storeAs('products', $filename, 'public');
                    $imagePaths[] = Storage::disk('public')->url($path);

                    // Save record connection
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $path,
                        'sort_order' => $index,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Product '{$product->title}' has been successfully created with SKU: {$product->sku}.",
                'product' => [
                    'id' => $product->id,
                    'title' => $product->title,
                    'slug' => $product->slug,
                    'sku' => $product->sku,
                    'inventory' => $product->inventory,
                    'base_price' => $product->base_price,
                    'discount_price' => $product->discount_price,
                    'images' => $imagePaths,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'An error occurred while creating product: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        $product->load(['category', 'images']);
        return view('admin.products.show', compact('product'));
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product)
    {
        DB::beginTransaction();

        try {
            // Load and delete related images from storage
            $images = $product->images;
            foreach ($images as $img) {
                if (Storage::disk('public')->exists($img->image_path)) {
                    Storage::disk('public')->delete($img->image_path);
                }
                $img->delete();
            }

            // Delete the product
            $product->delete();

            DB::commit();

            return redirect()
                ->route('admin.products.index')
                ->with('success', "Product and associated media assets were permanently purged.");

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()
                ->route('admin.products.index')
                ->with('error', 'Failed to delete product: ' . $e->getMessage());
        }
    }
}
