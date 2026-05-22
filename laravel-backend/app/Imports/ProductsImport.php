<?php

namespace App\Imports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Str;

class ProductsImport implements ToModel, WithHeadingRow
{
    private int $processedRows = 0;
    private int $failedRows = 0;
    private array $errorsLog = [];

    /**
     * Parse each row from the spreadsheet.
     *
     * @param array $row
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        try {
            // Check SKU presence
            $sku = trim($row['sku'] ?? '');
            if (empty($sku)) {
                $this->failedRows++;
                $this->errorsLog[] = "Missing SKU for row titled: " . ($row['title'] ?? 'Unknown');
                return null;
            }

            // Find matching product by SKU
            $product = Product::where('sku', $sku)->first();

            if ($product) {
                // If duplicate SKU exists, update inventory/stock levels
                $oldStock = $product->inventory;
                $newStock = intval($row['inventory'] ?? 0);
                $product->update([
                    'inventory' => $oldStock + $newStock,
                ]);
                $this->processedRows++;
                return null; // Return null as we are updating existing, not creating a new row
            }

            // If SKU is unique, create a brand-new row mapping columns directly
            $title = $row['title'] ?? '';
            $categoryId = intval($row['category_id'] ?? 0);

            if (empty($title) || $categoryId <= 0) {
                $this->failedRows++;
                $this->errorsLog[] = "SKU {$sku} failed: Title or Category ID is invalid.";
                return null;
            }

            $newProduct = new Product([
                'category_id' => $categoryId,
                'title' => $title,
                'slug' => Str::slug($title),
                'short_description' => $row['short_description'] ?? $title,
                'long_description' => $row['long_description'] ?? $title,
                'dimensions' => $row['dimensions'] ?? 'Standard',
                'care_instructions' => $row['care_instructions'] ?? 'Wipe clean.',
                'base_price' => floatval($row['base_price'] ?? 0),
                'discount_price' => isset($row['discount_price']) && $row['discount_price'] !== '' ? floatval($row['discount_price']) : null,
                'sku' => $sku,
                'inventory' => intval($row['inventory'] ?? 0),
                'meta_title' => $row['meta_title'] ?? substr($title, 0, 60),
                'meta_description' => $row['meta_description'] ?? substr($title, 0, 160),
            ]);

            $this->processedRows++;
            return $newProduct;

        } catch (\Exception $e) {
            $this->failedRows++;
            $this->errorsLog[] = "Error processing row SKU " . ($row['sku'] ?? 'Unknown') . ": " . $e->getMessage();
            return null;
        }
    }

    /**
     * Get processed count.
     */
    public function getProcessedCount(): int
    {
        return $this->processedRows;
    }

    /**
     * Get failed count.
     */
    public function getFailedCount(): int
    {
        return $this->failedRows;
    }

    /**
     * Get errors log list.
     */
    public function getErrorsLog(): array
    {
        return $this->errorsLog;
    }
}
