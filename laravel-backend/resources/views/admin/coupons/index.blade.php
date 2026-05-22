@extends('layouts.admin')

@section('title', 'Promotional Coupon Engine')
@section('header_title', 'Marketing Promotions Creator')

@section('styles')
<style>
    .coupon-container {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 40px;
    }

    .coupon-card {
        background-color: white;
        border: 1px solid var(--soft-grey);
        border-radius: 4px;
        padding: 30px;
        min-height: 500px;
    }

    /* Table details */
    .table-coupon {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
        margin-top: 20px;
    }

    .table-coupon th {
        padding: 14px;
        background-color: var(--warm-ivory);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
        color: var(--dark-grey);
        border-bottom: 1px solid var(--soft-grey);
    }

    .table-coupon td {
        padding: 14px;
        font-size: 13px;
        border-bottom: 1px solid var(--warm-ivory);
        vertical-align: middle;
    }

    .table-coupon tr:hover td {
        background-color: rgba(250, 249, 246, 0.5);
    }

    /* Form stylings */
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 20px;
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

    .coupon-code-badge {
        font-family: monospace;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.05em;
        background-color: var(--warm-ivory);
        padding: 6px 12px;
        border: 1px dashed var(--soft-grey);
        border-radius: 4px;
        color: var(--charcoal);
        display: inline-block;
    }
</style>
@endsection

@section('content')
<div class="coupon-container">
    <!-- List of active promo rules -->
    <div class="coupon-card">
        <div style="margin-bottom: 24px;">
            <h2 style="font-size: 18px; margin-bottom: 6px;">Active Promo Rules</h2>
            <p style="color: var(--dark-grey); font-size: 14px;">Establish standard percentage reductions or flat-deduction models with expiration thresholds.</p>
        </div>

        <table class="table-coupon">
            <thead>
                <tr>
                    <th>Promo Code</th>
                    <th>Type</th>
                    <th>Reduction</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th style="text-align: right;">Actions</th>
                </tr>
            </thead>
            <tbody>
                @if($coupons->count() > 0)
                    @foreach($coupons as $coupon)
                        <tr>
                            <td><span class="coupon-code-badge">{{ $coupon->code }}</span></td>
                            <td style="text-transform: uppercase;"><strong>{{ $coupon->type }}</strong></td>
                            <td>
                                <strong style="color: var(--clay);">
                                    @if($coupon->type === 'percentage')
                                        {{ $coupon->value }}% OFF
                                    @else
                                        ₹{{ number_format($coupon->value, 2) }} OFF
                                    @endif
                                </strong>
                            </td>
                            <td>
                                <span class="{{ $coupon->expiry_date->isPast() ? 'text-decoration: line-through; color: var(--error);' : '' }}">
                                    {{ $coupon->expiry_date->format('M d, Y') }}
                                </span>
                            </td>
                            <td>
                                @if($coupon->isValid())
                                    <span class="badge badge-paid" style="background-color: rgba(62,142,98,0.1); color: var(--success);">Active</span>
                                @else
                                    <span class="badge badge-failed" style="background-color: rgba(188,71,71,0.1); color: var(--error);">Expired/Disabled</span>
                                @endif
                            </td>
                            <td style="text-align: right;">
                                <div style="display: inline-flex; gap: 10px; justify-content: flex-end; width:100%;">
                                    <!-- Toggle Active -->
                                    <form action="{{ route('admin.coupons.toggle', $coupon->id) }}" method="POST" style="margin:0;">
                                        @csrf
                                        <button type="submit" class="btn btn-outline" style="padding: 6px 12px; font-size: 11px;">
                                            {{ $coupon->is_active ? 'Deactivate' : 'Activate' }}
                                        </button>
                                    </form>

                                    <!-- Delete Rule -->
                                    <form action="{{ route('admin.coupons.destroy', $coupon->id) }}" method="POST" onsubmit="return confirm('Delete this coupon rule permanently?');" style="margin:0;">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-outline" style="padding: 6px 12px; font-size: 11px; color: var(--error); border-color: rgba(188,71,71,0.2)">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 40px; color: var(--dark-grey);">No active coupon rules recorded. Create one using the builder on the right!</td>
                    </tr>
                @endif
            </tbody>
        </table>

        <!-- Pagination -->
        <div style="margin-top: 24px; display: flex; justify-content: center;">
            {{ $coupons->links() }}
        </div>
    </div>

    <!-- Creator Form Builder -->
    <div class="coupon-card" style="min-height: auto;">
        <div style="margin-bottom: 20px; border-bottom: 1px solid var(--soft-grey); padding-bottom: 14px;">
            <h3 style="font-size: 16px; color: var(--clay);">Inject Coupon Code</h3>
        </div>

        <form action="{{ route('admin.coupons.store') }}" method="POST">
            @csrf

            <div class="form-group">
                <label class="form-label" for="code">Promo Code *</label>
                <input class="form-input" type="text" id="code" name="code" placeholder="e.g. ELEVATE20" style="text-transform: uppercase;" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="type">Discount Type *</label>
                <select class="form-input" id="type" name="type" required>
                    <option value="percentage">Percentage Reduction (%)</option>
                    <option value="fixed">Fixed Deductions (₹)</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label" for="value">Discount Value *</label>
                <input class="form-input" type="number" step="0.01" id="value" name="value" placeholder="e.g. 20" required>
            </div>

            <div class="form-group">
                <label class="form-label" for="expiry_date">Expiry Date Threshold *</label>
                <input class="form-input" type="date" id="expiry_date" name="expiry_date" min="{{ date('Y-m-d') }}" required>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">Activate Promo Code</button>
        </form>
    </div>
</div>
@endsection
