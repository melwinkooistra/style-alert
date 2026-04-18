import asyncio
from playwright.async_api import async_playwright
from supabase import create_client

SUPABASE_URL = "https://wsqenxsggsytkctzvrts.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzcWVueHNnZ3N5dGtjdHp2cnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDQyNjQsImV4cCI6MjA5MjAyMDI2NH0.q1p_7d6M4u2Ds0GlycGGw2IKi833WwjGUKjvh5dTOuE"

BRAND_URLS = {
    "Ralph Lauren": "https://www.ralphlauren.com/sale-men-clothing",
}

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

async def scrape_brand(page, brand_name, url):
    print(f"Checking {brand_name}...")
    try:
        await page.goto(url, timeout=30000)
        await page.wait_for_timeout(10000)

        products = await page.evaluate('''() => {
            const items = []
            document.querySelectorAll('[class*="product"]').forEach(el => {
                const original = el.querySelector('[class*="original"], [class*="was"], [class*="strikethrough"]')
                const sale = el.querySelector('[class*="sale"], [class*="discount"], [class*="price"]')
                const name = el.querySelector('[class*="name"], [class*="title"]')
                if (original && sale && name) {
                    items.push({
                        name: name.innerText.trim(),
                        original: original.innerText.trim(),
                        sale: sale.innerText.trim(),
                    })
                }
            })
            return items
        }''')

        print(f"Found {len(products)} products on {brand_name}")
        return products
    except Exception as e:
        print(f"Error scraping {brand_name}: {e}")
        return []

async def main():
    response = supabase.table("brands").select("*").execute()
    user_brands = response.data
    print(f"Found {len(user_brands)} user preferences in database")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()

        for brand_entry in user_brands:
            brand_name = brand_entry["brand_name"]
            min_discount = brand_entry["min_discount"]

            if brand_name in BRAND_URLS:
                products = await scrape_brand(page, brand_name, BRAND_URLS[brand_name])
                print(f"User wants {min_discount}% off {brand_name}, found {len(products)} products")
            else:
                print(f"No URL configured for {brand_name}")

        await browser.close()

asyncio.run(main())