<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Luxury Furniture Replica') - West Elm India</title>
    <!-- Google Fonts Outfit & Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <!-- Premium Client Styles -->
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
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
        }

        body {
            background-color: white;
            color: var(--charcoal);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        h1, h2, h3, h4, h5, .font-title {
            font-family: 'Outfit', sans-serif;
            font-weight: 500;
            letter-spacing: 0.03em;
        }

        main {
            flex: 1;
            padding-bottom: 80px;
        }

        /* Footer styling mimicking premium layouts */
        footer {
            background-color: var(--charcoal);
            color: white;
            padding: 80px 40px 40px;
            border-top: 1px solid var(--soft-grey);
        }

        .footer-grid {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 40px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 60px;
            margin-bottom: 40px;
        }

        .footer-column {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .footer-header {
            font-family: 'Outfit', sans-serif;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--warm-ivory);
        }

        .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .footer-link {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            text-decoration: none;
            transition: color 0.2s ease;
        }

        .footer-link:hover {
            color: white;
        }

        .footer-bottom {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.4);
            letter-spacing: 0.05em;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: white;
        }
        ::-webkit-scrollbar-thumb {
            background: #DDDDDD;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #CCCCCC;
        }

        @media (max-width: 900px) {
            .footer-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 500px) {
            .footer-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
    @yield('styles')
</head>
<body>

    <!-- Embed the dynamic megamenu component -->
    <x-navigation />

    <!-- Main Content -->
    <main>
        @yield('content')
    </main>

    <!-- Footer -->
    <footer>
        <div class="footer-grid">
            <div class="footer-column">
                <h4 class="footer-header">Customer Service</h4>
                <ul class="footer-links">
                    <li><a href="#" class="footer-link">Contact Us</a></li>
                    <li><a href="#" class="footer-link">Track Your Order</a></li>
                    <li><a href="#" class="footer-link">Returns & Exchanges</a></li>
                    <li><a href="#" class="footer-link">Shipping Information</a></li>
                </ul>
            </div>

            <div class="footer-column">
                <h4 class="footer-header">Our Story</h4>
                <ul class="footer-links">
                    <li><a href="#" class="footer-link">About West Elm</a></li>
                    <li><a href="#" class="footer-link">Sustainably Sourced</a></li>
                    <li><a href="#" class="footer-link">Collaborations</a></li>
                    <li><a href="#" class="footer-link">Design Services</a></li>
                </ul>
            </div>

            <div class="footer-column">
                <h4 class="footer-header">Shop Collections</h4>
                <ul class="footer-links">
                    <li><a href="#" class="footer-link">Living Room Furniture</a></li>
                    <li><a href="#" class="footer-link">Bedroom Collections</a></li>
                    <li><a href="#" class="footer-link">Dining & Kitchen Tables</a></li>
                    <li><a href="#" class="footer-link">Lighting & Decor</a></li>
                </ul>
            </div>

            <div class="footer-column" style="gap: 16px;">
                <h4 class="footer-header">E-Commerce Newsletter</h4>
                <p style="font-size: 11px; color: rgba(255,255,255,0.6); line-height: 1.5;">Subscribe for summer collections catalogs releases and promotional coupon events.</p>
                <div style="display:flex;">
                    <input type="email" placeholder="Email Address..." style="padding: 10px; font-size:12px; border:none; outline:none; flex:1; border-radius: 2px 0 0 2px;">
                    <button style="background-color: var(--clay); color:white; border:none; padding: 10px 16px; font-size:11px; text-transform:uppercase; font-weight:600; border-radius:0 2px 2px 0; cursor:pointer;">Join</button>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <span>© 2026 West Elm India Replica. Built with PHP Laravel 11 & MySQL 8.0+ Relational Architect.</span>
            <span>PRIVACY POLICY &nbsp;&nbsp;|&nbsp;&nbsp; TERMS & CONDITIONS</span>
        </div>
    </footer>

    @yield('scripts')
</body>
</html>
