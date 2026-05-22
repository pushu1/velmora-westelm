@php
    // Eager load category tree (3 tiers)
    $navigationTree = \App\Models\Category::with(['children.children' => function($q) {
        $q->orderBy('name', 'asc');
    }])
    ->whereNull('parent_id')
    ->orderBy('name', 'asc')
    ->get();
@endphp

<!-- Luxury Editorial Header Navigation Bar -->
<nav class="luxury-navbar">
    <!-- Announcement top carousel bar -->
    <div class="announcement-bar">
        <div class="announcement-text">
            <span>✨ SUMMER ESSENTIALS: UP TO 30% OFF PREMIUM SEATING & TABLES</span>
        </div>
    </div>

    <!-- Main Global Header Panel -->
    <div class="navbar-header-main">
        <div class="navbar-wrapper">
            <!-- Left search element -->
            <div class="nav-search-box">
                <input type="text" placeholder="Search premium furniture, decor...">
                <svg fill="none" stroke="currentColor" width="18" height="18" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>

            <!-- Centered Luxury Logo -->
            <a href="/" class="brand-logo">
                WEST ELM
            </a>

            <!-- Right user interactions -->
            <div class="nav-user-actions">
                @auth
                    <div class="nav-profile-dropdown">
                        <span class="nav-profile-name">Hello, {{ explode(' ', auth()->user()->name)[0] }}</span>
                        @if(auth()->user()->isAdmin())
                            <a href="{{ route('admin.dashboard') }}" class="nav-icon-link" title="Admin Portal">
                                <svg fill="none" stroke="currentColor" width="20" height="20" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </a>
                        @endif
                    </div>
                @else
                    <a href="/login" class="nav-btn-login">Sign In</a>
                @endauth

                <!-- Cart indicator -->
                <a href="/cart" class="nav-icon-link cart-indicator">
                    <svg fill="none" stroke="currentColor" width="20" height="20" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    <span class="cart-badge">0</span>
                </a>
            </div>
        </div>
    </div>

    <!-- TIER 1 (Roots) Global Hover Navigation Row -->
    <div class="navbar-roots-menu">
        <ul class="roots-list">
            @foreach($navigationTree as $root)
                <li class="root-item">
                    <a href="/category/{{ $root->slug }}" class="root-link">{{ $root->name }}</a>
                    
                    <!-- TIER 2 & 3: Dynamic Megamenu Flyout Dropdown -->
                    @if($root->children->count() > 0)
                        <div class="megamenu-dropdown-pane">
                            <div class="megamenu-columns-grid">
                                @foreach($root->children as $sub)
                                    <div class="megamenu-column">
                                        <!-- Tier 2 Header -->
                                        <a href="/category/{{ $sub->slug }}" class="megamenu-header-link">
                                            {{ $sub->name }}
                                        </a>

                                        <!-- Tier 3 Sub-links -->
                                        @if($sub->children->count() > 0)
                                            <ul class="megamenu-sublinks-list">
                                                @foreach($sub->children as $subSub)
                                                    <li>
                                                        <a href="/category/{{ $subSub->slug }}" class="megamenu-sub-link">
                                                            {{ $subSub->name }}
                                                        </a>
                                                    </li>
                                                @endforeach
                                            </ul>
                                        @endif
                                    </div>
                                @endforeach

                                <!-- Promotional visual card inside megamenu for premium retail feel -->
                                <div class="megamenu-column megamenu-promo-column">
                                    <div class="promo-card">
                                        <div class="promo-title">The Summer Collection</div>
                                        <div class="promo-subtitle">Handcrafted sustainably sourced teak wood furniture.</div>
                                        <a href="/collection/summer" class="promo-link">Explore Editorial</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endif
                </li>
            @endforeach
        </ul>
    </div>
</nav>

<!-- Navbar styling definitions -->
<style>
    .luxury-navbar {
        background-color: white;
        border-bottom: 1px solid var(--soft-grey);
        width: 100%;
        position: sticky;
        top: 0;
        z-index: 1000;
    }

    .announcement-bar {
        background-color: var(--charcoal);
        color: white;
        text-align: center;
        padding: 10px 20px;
        font-family: 'Outfit', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .navbar-header-main {
        padding: 24px 40px;
        border-bottom: 1px solid var(--soft-grey);
    }

    .navbar-wrapper {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .nav-search-box {
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--charcoal);
        padding-bottom: 6px;
        width: 250px;
    }

    .nav-search-box input {
        border: none;
        outline: none;
        font-size: 12px;
        width: 100%;
        letter-spacing: 0.02em;
    }

    .nav-search-box svg {
        color: var(--charcoal);
    }

    .brand-logo {
        font-family: 'Outfit', sans-serif;
        font-size: 30px;
        font-weight: 700;
        letter-spacing: 0.25em;
        text-decoration: none;
        color: var(--charcoal);
        display: inline-block;
        transform: translateX(35px); /* Offset to balance layout visual weight */
    }

    .nav-user-actions {
        display: flex;
        align-items: center;
        gap: 24px;
    }

    .nav-btn-login {
        font-size: 12px;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.08em;
        color: var(--charcoal);
        text-decoration: none;
        border: 1px solid var(--charcoal);
        padding: 6px 16px;
        border-radius: 2px;
        transition: all 0.2s ease;
    }

    .nav-btn-login:hover {
        background-color: var(--charcoal);
        color: white;
    }

    .nav-icon-link {
        color: var(--charcoal);
        text-decoration: none;
        position: relative;
    }

    .cart-indicator {
        display: flex;
        align-items: center;
    }

    .cart-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background-color: var(--clay);
        color: white;
        font-size: 9px;
        font-weight: 700;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Roots menu list styling */
    .navbar-roots-menu {
        max-width: 1000px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
    }

    .roots-list {
        list-style: none;
        display: flex;
        gap: 36px;
        padding: 0;
        margin: 0;
    }

    .root-item {
        position: relative;
        padding: 16px 0;
    }

    .root-link {
        font-family: 'Outfit', sans-serif;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--charcoal);
        text-decoration: none;
        transition: color 0.2s ease;
    }

    .root-item:hover .root-link {
        color: var(--clay);
    }

    /* MEGAMENU FLYOUT PANEL */
    .megamenu-dropdown-pane {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        width: 900px;
        background-color: white;
        border: 1px solid var(--soft-grey);
        box-shadow: 0 15px 30px rgba(0,0,0,0.05);
        padding: 36px 40px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
        z-index: 999;
        pointer-events: none;
    }

    .root-item:hover .megamenu-dropdown-pane {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
    }

    .megamenu-columns-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 30px;
    }

    .megamenu-column {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .megamenu-header-link {
        font-family: 'Outfit', sans-serif;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--charcoal);
        text-decoration: none;
        border-bottom: 1px solid var(--warm-ivory);
        padding-bottom: 8px;
    }

    .megamenu-header-link:hover {
        color: var(--clay);
    }

    .megamenu-sublinks-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .megamenu-sub-link {
        font-size: 12px;
        color: var(--dark-grey);
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .megamenu-sub-link:hover {
        color: var(--charcoal);
        padding-left: 2px;
    }

    /* Megamenu Promo card column */
    .megamenu-promo-column {
        background-color: var(--warm-ivory);
        border: 1px solid var(--soft-grey);
        padding: 24px;
        border-radius: 2px;
        justify-content: center;
    }

    .promo-card {
        text-align: center;
    }

    .promo-title {
        font-family: 'Outfit', sans-serif;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        margin-bottom: 8px;
        color: var(--charcoal);
    }

    .promo-subtitle {
        font-size: 11px;
        color: var(--dark-grey);
        margin-bottom: 16px;
        line-height: 1.4;
    }

    .promo-link {
        font-family: 'Outfit', sans-serif;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: white;
        background-color: var(--charcoal);
        padding: 8px 16px;
        text-decoration: none;
        display: inline-block;
        border-radius: 2px;
        transition: background-color 0.2s ease;
    }

    .promo-link:hover {
        background-color: var(--clay);
    }
</style>
