# Style Alert — Technical Brief

## What this app does
Style Alert is a personal shopping notification app. Users create a watchlist with specific clothing preferences. When a matching product goes on sale, the user receives a notification with a direct purchase link.

## Core user flow
1. User creates a watchlist item: brand + clothing type + size + minimum discount %
2. The app checks product feeds for matches
3. When a match is found, the user gets an email notification with a direct link
4. Post-notification flow handles watchlist management

## Tech stack
- Frontend: React (Vite)
- Database: Supabase
- Product data: Affiliate network feeds
- Notifications: Email (MVP), push notifications (later)
- Hosting: GitHub Actions (scraper), TBD (frontend)

## Current state
- React frontend with watchlist form (brand, clothing type, size, discount threshold)
- Supabase database connected
- Feed integration in progress

## Important rules
- Every notification must deep-link to the exact product page
- Size matching is mandatory
- Keep the UI simple and mobile-friendly
