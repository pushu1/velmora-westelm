@extends('layouts.admin')

@section('title', 'Pipeline User Audits')
@section('header_title', 'Credential & Purchase Auditor')

@section('styles')
<style>
    .audit-card {
        background-color: white;
        border: 1px solid var(--soft-grey);
        border-radius: 4px;
        padding: 30px;
    }

    /* Table styling */
    .table-responsive {
        width: 100%;
        overflow-x: auto;
        margin-top: 24px;
    }

    .table-audit {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
    }

    .table-audit th {
        padding: 16px;
        background-color: var(--warm-ivory);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
        color: var(--dark-grey);
        border-bottom: 1px solid var(--soft-grey);
    }

    .table-audit td {
        padding: 16px;
        font-size: 14px;
        border-bottom: 1px solid var(--warm-ivory);
        vertical-align: middle;
    }

    .table-audit tr:hover td {
        background-color: rgba(250, 249, 246, 0.5);
    }

    /* Search bar layout */
    .filter-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        margin-bottom: 24px;
    }

    .search-input-group {
        display: flex;
        width: 100%;
        max-width: 400px;
    }

    .search-input {
        flex: 1;
        padding: 10px 16px;
        border: 1px solid var(--soft-grey);
        background-color: var(--warm-ivory);
        font-size: 14px;
        border-radius: 4px 0 0 4px;
        outline: none;
    }

    .search-input:focus {
        border-color: var(--charcoal);
        background-color: white;
    }

    .search-btn {
        padding: 10px 20px;
        background-color: var(--charcoal);
        color: white;
        border: none;
        border-radius: 0 4px 4px 0;
        cursor: pointer;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    /* Pagination container style */
    .pagination-wrapper {
        margin-top: 30px;
        display: flex;
        justify-content: center;
    }

    .pagination-wrapper nav svg {
        width: 20px;
        height: 20px;
    }
</style>
@endsection

@section('content')
<div class="audit-card">
    <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; margin-bottom: 6px;">Customer Accounts Database</h2>
        <p style="color: var(--dark-grey); font-size: 14px;">Audit registration coordinates, role levels, total lifetime spent, and credential states.</p>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
        <form action="{{ route('admin.users.index') }}" method="GET" class="search-input-group">
            <input type="text" name="search" class="search-input" placeholder="Search by name or email..." value="{{ $search }}">
            <button type="submit" class="search-btn">Search</button>
        </form>
        @if($search)
            <a href="{{ route('admin.users.index') }}" class="btn btn-outline" style="padding: 8px 16px; font-size: 12px;">Clear Filters</a>
        @endif
    </div>

    <!-- Responsive Table -->
    <div class="table-responsive">
        <table class="table-audit">
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Role Clearance</th>
                    <th>Completed Orders</th>
                    <th>Lifetime Spent</th>
                    <th>Registration Date</th>
                    <th style="text-align: right;">Modify Profile</th>
                </tr>
            </thead>
            <tbody>
                @if($users->count() > 0)
                    @foreach($users as $user)
                        <tr>
                            <td><strong>#{{ $user->id }}</strong></td>
                            <td>{{ $user->name }}</td>
                            <td>{{ $user->email }}</td>
                            <td>
                                <span class="badge badge-{{ $user->role }}">
                                    {{ $user->role }}
                                </span>
                            </td>
                            <td>{{ $user->orders_count }} paid orders</td>
                            <td>
                                <strong style="color: var(--clay);">
                                    ₹{{ number_format($user->lifetime_value ?? 0, 2) }}
                                </strong>
                            </td>
                            <td>{{ $user->created_at->format('M d, Y H:i') }}</td>
                            <td style="text-align: right;">
                                <div style="display: inline-flex; gap: 10px; align-items: center;">
                                    
                                    <!-- Role Promotion Form -->
                                    <form action="{{ route('admin.users.update', $user->id) }}" method="POST" style="margin:0; display:flex; align-items:center;">
                                        @csrf
                                        @method('PUT')
                                        <select name="role" class="form-input" style="padding: 6px 12px; font-size: 12px; background-color: var(--warm-ivory); border-radius: 4px;" onchange="this.form.submit()">
                                            <option value="user" {{ $user->role === 'user' ? 'selected' : '' }}>User</option>
                                            <option value="admin" {{ $user->role === 'admin' ? 'selected' : '' }}>Admin</option>
                                        </select>
                                    </form>

                                    <!-- Delete Button -->
                                    <form action="{{ route('admin.users.destroy', $user->id) }}" method="POST" onsubmit="return confirm('DANGER: Permanently delete this customer record and all order history from system databases? This cannot be undone.');" style="margin:0;">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-outline" style="padding: 6px 12px; font-size: 11px; color: var(--error); border-color: rgba(188,71,71,0.3); background-color: rgba(188,71,71,0.02)">
                                            Purge
                                        </button>
                                    </form>

                                </div>
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 40px; color: var(--dark-grey);">No matching records found in system database.</td>
                    </tr>
                @endif
            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-wrapper">
        {{ $users->links() }}
    </div>
</div>
@endsection
