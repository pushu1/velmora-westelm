<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => 'required|integer|exists:categories,id',
            'title' => 'required|string|max:255|unique:products,title',
            'short_description' => 'required|string',
            'long_description' => 'required|string',
            'dimensions' => 'required|string|max:255',
            'care_instructions' => 'required|string',
            'base_price' => 'required|numeric|min:0.01',
            // discount_price must be strictly less than base_price
            'discount_price' => 'nullable|numeric|min:0.00|lt:base_price',
            'sku' => 'required|string|unique:products,sku|max:100',
            'inventory' => 'required|integer|min:0',
            // SEO Meta elements length bounds (60 max for title, 160 max for description)
            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            // Upload concurrent array of 5+ images
            'images' => 'required|array|min:1|max:10',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240', // max 10MB per high-resolution image
        ];
    }

    /**
     * Custom validation error messages.
     */
    public function messages(): array
    {
        return [
            'discount_price.lt' => 'The markdown discount price must be strictly less than the product base price.',
            'meta_title.max' => 'The meta title cannot exceed 60 characters for optimal Google indexing visibility.',
            'meta_description.max' => 'The meta description cannot exceed 160 characters for optimal Google indexing snippet layouts.',
            'images.min' => 'Please select at least 1 product image to proceed.',
            'images.max' => 'You cannot upload more than 10 images concurrently.',
            'images.*.image' => 'All uploaded files must be valid image assets.',
            'images.*.max' => 'Each individual high-resolution image cannot exceed 10 megabytes.',
        ];
    }
}
