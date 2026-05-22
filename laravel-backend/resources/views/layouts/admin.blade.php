<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin Portal') - West Elm India Replica</title>
    <!-- Google Fonts Outfit & Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <!-- Premium CSS Styling -->
    <style>
        :root {
            --charcoal: #222222;
            --off-black: #1A1A1A;
            --warm-ivory: #FAF9F6;
            --clay: #C07A65;
            --soft-grey: #E5E5E5;
            --dark-grey: #555555;
            --success: #3E8E62;
            --error: #BC4747;
            --nav-width: 280px;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
        }

        body {
            background-color: var(--warm-ivory);
            color: var(--charcoal);
            display: flex;
            min-height: 100vh;
            overflow-x: hidden;
        }

        h1, h2, h3, h4, h5, .font-title {
            font-family: 'Outfit', sans-serif;
            font-weight: 500;
            letter-spacing: 0.03em;
        }

        /* Sidebar Styling */
        aside {
            width: var(--nav-width);
            background-color: var(--charcoal);
            color: white;
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 100;
            border-right: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
        }

        .sidebar-brand {
            padding: 30px 24px;
            font-family: 'Outfit', sans-serif;
            font-size: 20px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            font-weight: 600;
            color: var(--warm-ivory);
        }

        .sidebar-brand span {
            color: var(--clay);
        }

        .sidebar-menu {
            list-style: none;
            padding: 24px 0;
            flex: 1;
            overflow-y: auto;
        }

        .sidebar-menu::-webkit-scrollbar {
            width: 4px;
        }
        .sidebar-menu::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
        }

        .sidebar-item {
            margin: 4px 16px;
        }

        .sidebar-link {
            display: flex;
            align-items: center;
            padding: 14px 16px;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.02em;
            transition: all 0.2s ease;
        }

        .sidebar-link:hover, .sidebar-item.active .sidebar-link {
            color: white;
            background-color: rgba(255, 255, 255, 0.06);
        }

        .sidebar-item.active .sidebar-link {
            border-left: 3px solid var(--clay);
            background-color: rgba(255, 255, 255, 0.08);
            color: white;
        }

        .sidebar-link svg {
            margin-right: 12px;
            width: 18px;
            height: 18px;
            stroke-width: 2;
        }

        .sidebar-footer {
            padding: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 12px;
            color: rgba(255, 255, 255, 0.4);
            letter-spacing: 0.02em;
        }

        /* Main Workspace Content */
        main {
            margin-left: var(--nav-width);
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        /* Top Admin Bar Header */
        header {
            height: 80px;
            background-color: white;
            border-bottom: 1px solid var(--soft-grey);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 40px;
            position: sticky;
            top: 0;
            z-index: 90;
        }

        .header-title h1 {
            font-size: 24px;
            color: var(--charcoal);
            font-weight: 600;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 24px;
        }

        .admin-profile {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: var(--charcoal);
        }

        .admin-avatar {
            width: 40px;
            height: 40px;
            background-color: var(--charcoal);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Outfit', sans-serif;
            font-weight: 600;
            font-size: 15px;
            border: 2px solid var(--clay);
        }

        .admin-name {
            font-size: 14px;
            font-weight: 600;
        }

        .logout-btn {
            font-size: 13px;
            color: var(--dark-grey);
            text-decoration: none;
            background: none;
            border: 1px solid var(--soft-grey);
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .logout-btn:hover {
            color: var(--charcoal);
            background-color: rgba(0, 0, 0, 0.02);
            border-color: var(--charcoal);
        }

        /* Workspace Grid spacing */
        .workspace-content {
            padding: 40px;
            flex: 1;
            max-width: 1600px;
            width: 100%;
            margin: 0 auto;
        }

        /* Custom alert bubbles */
        .alert {
            padding: 16px 24px;
            border-radius: 4px;
            margin-bottom: 30px;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .alert-success {
            background-color: rgba(62, 142, 98, 0.08);
            border: 1px solid var(--success);
            color: var(--success);
        }

        .alert-error {
            background-color: rgba(188, 71, 71, 0.08);
            border: 1px solid var(--error);
            color: var(--error);
        }

        .alert-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            font-weight: 700;
            font-size: 16px;
        }

        /* Premium Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.25s ease;
            text-decoration: none;
            border: none;
        }

        .btn-primary {
            background-color: var(--charcoal);
            color: white;
        }

        .btn-primary:hover {
            background-color: var(--off-black);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .btn-clay {
            background-color: var(--clay);
            color: white;
        }

        .btn-clay:hover {
            background-color: #B16650;
            box-shadow: 0 4px 12px rgba(192, 122, 101, 0.2);
        }

        .btn-outline {
            background-color: transparent;
            border: 1px solid var(--charcoal);
            color: var(--charcoal);
        }

        .btn-outline:hover {
            background-color: rgba(0, 0, 0, 0.02);
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            border-radius: 2px;
            letter-spacing: 0.05em;
        }

        .badge-admin {
            background-color: rgba(192, 122, 101, 0.15);
            color: var(--clay);
        }

        .badge-user {
            background-color: var(--soft-grey);
            color: var(--dark-grey);
        }

        .badge-paid {
            background-color: rgba(62, 142, 98, 0.15);
            color: var(--success);
        }

        .badge-pending {
            background-color: rgba(229, 229, 229, 0.5);
            color: var(--dark-grey);
        }

        .badge-failed {
            background-color: rgba(188, 71, 71, 0.15);
            color: var(--error);
        }

        /* Custom Scrollbar for Workspace */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: var(--warm-ivory);
        }
        ::-webkit-scrollbar-thumb {
            background: #CCCCCC;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #AAAAAA;
        }
    </style>
    @yield('styles')
</head>
<body>

    <!-- Sidebar Navigation -->
    <aside>
        <div class="sidebar-brand">
            West Elm<span>.IN</span>
        </div>
        <ul class="sidebar-menu">
            <li class="sidebar-item {{ Request::routeIs('admin.dashboard') ? 'active' : '' }}">
                <a href="{{ route('admin.dashboard') }}" class="sidebar-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path></svg>
                    Dashboard
                </a>
            </li>
            <li class="sidebar-item {{ Request::routeIs('admin.products.*') ? 'active' : '' }}">
                <a href="{{ route('admin.products.index') }}" class="sidebar-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    Products List
                </a>
            </li>
            <li class="sidebar-item {{ Request::routeIs('admin.products.create') ? 'active' : '' }}">
                <a href="{{ route('admin.products.create') }}" class="sidebar-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
                    Add Product
                </a>
            </li>
            <li class="sidebar-item {{ Request::routeIs('admin.categories.*') ? 'active' : '' }}">
                <a href="{{ route('admin.categories.index') }}" class="sidebar-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path></svg>
                    Category Hierarchy
                </a>
            </li>
            <li class="sidebar-item {{ Request::routeIs('admin.excel.*') ? 'active' : '' }}">
                <a href="{{ route('admin.excel.index') }}" class="sidebar-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Bulk Ingestion
                </a>
            </li>
            <li class="sidebar-item {{ Request::routeIs('admin.users.*') ? 'active' : '' }}">
                <a href="{{ route('admin.users.index') }}" class="sidebar-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    Audits & Users
                </a>
            </li>
            <li class="sidebar-item {{ Request::routeIs('admin.coupons.*') ? 'active' : '' }}">
                <a href="{{ route('admin.coupons.index') }}" class="sidebar-link">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                    Coupons Engine
                </a>
            </li>
        </ul>
        <div class="sidebar-footer">
            © 2026 West Elm India Admin Panel. Enterprise Edition.
        </div>
    </aside>

    <!-- Content Area -->
    <main>
        <!-- Header -->
        <header>
            <div class="header-title">
                <h1>@yield('header_title', 'Overview')</h1>
            </div>
            <div class="header-actions">
                <a href="/" target="_blank" class="btn btn-outline" style="padding: 8px 16px; text-transform: none; font-size: 13px;">View Storefront</a>
                <div class="admin-profile">
                    <div class="admin-avatar">
                        {{ strtoupper(substr(auth()->user()->name ?? 'A', 0, 2)) }}
                    </div>
                    <span class="admin-name">{{ auth()->user()->name ?? 'Administrator' }}</span>
                </div>
                <form action="/logout" method="POST" style="margin: 0;">
                    @csrf
                    <button type="submit" class="logout-btn">Log Out</button>
                </form>
            </div>
        </header>

        <!-- Main Workspace -->
        <div class="workspace-content">
            <!-- Dynamic Notification Alerts -->
            @if(session('success'))
                <div class="alert alert-success" id="success-alert">
                    <span>{{ session('success') }}</span>
                    <button class="alert-close" onclick="document.getElementById('success-alert').remove()">×</button>
                </div>
            @endif

            @if(session('error'))
                <div class="alert alert-error" id="error-alert">
                    <span>{{ session('error') }}</span>
                    <button class="alert-close" onclick="document.getElementById('error-alert').remove()">×</button>
                </div>
            @endif

            @yield('content')
        </div>
    </main>

    @yield('scripts')
</body>
</html>
