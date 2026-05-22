<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserAuditController extends Controller
{
    /**
     * Display a paginated, searchable user datatable with purchase histories.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $query = User::withCount('orders')
            ->withSum(['orders as lifetime_value' => function ($q) {
                $q->where('payment_status', 'paid');
            }], 'total_amount')
            ->orderBy('created_at', 'desc');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        $users = $query->paginate(15)->appends(['search' => $search]);

        return view('admin.users.index', compact('users', 'search'));
    }

    /**
     * Update user details or toggle credentials status.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        // Prevent self-demotion
        if ($user->id === auth()->id() && $request->role !== 'admin') {
            return redirect()
                ->route('admin.users.index')
                ->with('error', 'Security lock: You cannot revoke administrator credentials from your own active profile.');
        }

        $user->update([
            'role' => $request->role,
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', "Credentials for '{$user->name}' have been updated successfully to role: " . strtoupper($user->role));
    }

    /**
     * Permanently delete user record.
     */
    public function destroy(User $user)
    {
        // Prevent self-deletion
        if ($user->id === auth()->id()) {
            return redirect()
                ->route('admin.users.index')
                ->with('error', 'Security lock: You cannot delete your own administrator profile.');
        }

        $user->delete();

        return redirect()
            ->route('admin.users.index')
            ->with('success', "User record has been permanently deleted from systems database.");
    }

    /**
     * API endpoint to get paginated searchable users.
     * GET /api/admin/users
     */
    public function apiIndex(Request $request)
    {
        $search = $request->input('search');

        $query = User::withCount('orders')
            ->withSum(['orders as lifetime_value' => function ($q) {
                $q->where('payment_status', 'paid');
            }], 'total_amount')
            ->orderBy('created_at', 'desc');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        $users = $query->paginate(15);

        return response()->json([
            'success' => true,
            'users' => $users
        ]);
    }

    /**
     * API endpoint to update user roles.
     * PUT /api/admin/users/{user}
     */
    public function apiUpdate(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        $user->update([
            'role' => $request->role,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Credentials for '{$user->name}' have been updated successfully.",
            'user' => $user
        ]);
    }

    /**
     * API endpoint to delete user.
     * DELETE /api/admin/users/{user}
     */
    public function apiDestroy(User $user)
    {
        // Prevent self-deletion if logged in (in decoupled dev fallback, we check ID)
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Security lock: You cannot delete your own profile.'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => "User record has been permanently deleted from database."
        ]);
    }
}
