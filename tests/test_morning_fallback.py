"""Morning defaults and catalog availability without a GPU or animation."""
import os
from playwright.sync_api import sync_playwright, expect

URL = os.environ.get("ELEMENT_PAINT_URL", "http://localhost:8080/")

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        for reduced, gpu in [("reduce", True), ("no-preference", False)]:
            context = browser.new_context(color_scheme="dark", reduced_motion=reduced)
            context.add_init_script("localStorage.setItem('ep_theme', 'dark')")
            if not gpu:
                context.add_init_script("""
                    const original = HTMLCanvasElement.prototype.getContext;
                    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
                        return type.startsWith('webgl') ? null : original.call(this, type, ...args);
                    };
                """)
            page = context.new_page()
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.goto(URL, wait_until="networkidle")
            expect(page.locator("html")).to_have_attribute("data-theme", "light")
            expect(page.locator("#paintBackground")).to_have_attribute(
                "data-state", "reduced-motion" if reduced == "reduce" else "fallback")
            expect(page.locator("#productGrid .product-card")).to_have_count(8)
            page.locator("#loadMoreBtn").click()
            expect(page.locator("#productGrid .product-card")).to_have_count(20)
            expect(page.locator("#brandFilter option")).to_have_count(5)
            page.locator("#searchInput").fill("krata")
            expect(page.locator("#emptyState")).to_be_visible()
            page.locator("[data-featured-product='atlas-blue']").click()
            expect(page.locator("#modalTitle")).to_have_text("PF-115 Blue (Havo rang)")
            page.keyboard.press("Escape")
            page.locator("[data-featured-product='berlak-ottocento']").click()
            expect(page.locator("#modalTitle")).to_have_text("Ottocento (Ipak va Baxmal)")
            page.keyboard.press("Escape")
            assert not errors, errors
            context.close()
        browser.close()
    print("[OK] Cream defaults with dark preferences, reduced motion and WebGL fallback passed.")

if __name__ == "__main__":
    test()
