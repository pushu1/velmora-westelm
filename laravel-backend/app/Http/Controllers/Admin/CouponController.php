<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Display a listing of coupons and coupon creation dashboard.
     */
    public function index()
    {
        $coupons = Coupon::orderBy('expiry_date', 'asc')->paginate(10);
        return view('admin.coupons.index', compact('coupons'));
    }

    /**
     * Store a newly created coupon in database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:coupons,code|max:50|alpha_dash',
            'type' => 'required|in:fixed,percentage',
            'value' => 'required|numeric|min:0.01',
            'expiry_date' => 'required|date|after_or_equal:today',
        ]);

        if ($request->type === 'percentage' && $request->value > 100) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Percentage discount value cannot exceed 100%.');
        }

        $coupon = Coupon::create([
            'code' => strtoupper($request->code),
            'type' => $request->type,
            'value' => $request->value,
            'expiry_date' => $request->expiry_date,
            'is_active' => true,
        ]);

        return redirect()
            ->route('admin.coupons.index')
            ->with('success', "Coupon promo code '{$coupon->code}' has been successfully created.");
    }

    /**
     * Toggle the active status of the coupon.
     */
    public function toggle(Coupon $coupon)
    {
        $coupon->update([
            'is_active' => !$coupon->is_active,
        ]);

        $status = $coupon->is_active ? 'ACTIVATED' : 'DEACTIVATED';
        return redirect()
            ->route('admin.coupons.index')
            ->with('success', "Coupon '{$coupon->code}' has been successfully {$status}.");
    }

    /**
     * Remove the specified coupon.
     */
    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return redirect()
            ->route('admin.coupons.index')
            ->with('success', "Coupon rule has been successfully deleted from database.");
    }

    /**
     * API endpoint to get all coupons.
     * GET /api/admin/coupons
     */
    public function apiIndex()
    {
        $coupons = Coupon::orderBy('expiry_date', 'asc')->get();
        return response()->json([
            'success' => true,
            'coupons' => $coupons
        ]);
    }

    /**
     * API endpoint to store a newly created coupon.
     * POST /api/admin/coupons
     */
    public function apiStore(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:coupons,code|max:50|alpha_dash',
            'type' => 'required|in:fixed,percentage',
            'value' => 'required|numeric|min:0.01',
            'expiry_date' => 'required|date|after_or_equal:today',
        ]);

        if ($request->type === 'percentage' && $request->value > 100) {
            return response()->json([
                'success' => false,
                'message' => 'Percentage discount value cannot exceed 100%.'
            ], 422);
        }

        $coupon = Coupon::create([
            'code' => strtoupper($request->code),
            'type' => $request->type,
            'value' => $request->value,
            'expiry_date' => $request->expiry_date,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Coupon promo code '{$coupon->code}' has been successfully created.",
            'coupon' => $coupon
        ], 201);
    }

    /**
     * API endpoint to delete coupon.
     * DELETE /api/admin/coupons/{coupon}
     */
    public function apiDestroy(Coupon $coupon)
    {
        $coupon->delete();
        return response()->json([
            'success' => true,
            'message' => "Coupon rule has been successfully deleted from database."
        ]);
    }
}
