# Style Alert — Project Brief

## What this app does
Style Alert is a personal shopping watchdog. Users enter specific clothing items they want (brand, type, size, minimum discount percentage). When a matching product goes on sale anywhere online, the user gets a notification with a direct link to buy.

## Core user flow
1. User creates a watchlist item: brand + clothing type + size + minimum discount %
2. The app checks product feeds (via Daisycon affiliate network) for matches
3. When a match is found, the user gets an email/push notification with a direct link
4. After the notification, the app asks: "Did you buy it? Stop searching?" (yes/no)
5. If yes, the watchlist item is marked inactive

## Why the feedback question matters
The yes/no answer after a notification generates conversion data. This data proves lead quality to retailers and is the foundation of the business model.

## Business model
Retailers pay per lead. Lead value is based on conversion rate. Higher conversion = higher price per lead.

## Tech stack
- Frontend: React (Vite)
- Database: Supabase
- Product data: Daisycon affiliate feed (Netherlands)
- Notifications: Email (MVP), push notifications (later)
- Hosting: GitHub Actions (scraper), TBD (frontend)

## Current state
- Basic React frontend exists with email, brand name, and min discount fields
- Supabase database connected with a brands table
- Basic scraper exists but needs to be replaced with Daisycon feed

## What needs to be built next
1. Expand watchlist form to include clothing type and size
2. Integrate Daisycon product feed
3. Match feed products against user watchlist
4. Send email notification on match
5. Add feedback question after notification

## Target market
Netherlands first, then expand across Europe.

## Important rules
- Every notification must deep-link to the exact product page
- Size matching is mandatory — no size = no notification
- Keep the UI simple and mobile-friendly