import time
import os
from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        page = browser.new_page()
        page.goto(os.environ.get("ELEMENT_PAINT_URL", "http://localhost:8080/element_paint_web/"), wait_until="networkidle")

        # 1. Initial count must be exactly 8
        count_init = page.locator("#productGrid .product-card").count()
        assert count_init == 8, f"Expected 8 initial, got {count_init}"

        # 2. Pagination button must be visible initially
        btn_visible = page.locator("#loadMoreBtn").is_visible()
        assert btn_visible, "Load more button must be visible initially"

        # 3. Click Load more -> count becomes 21 and pagination button hides
        page.click("#loadMoreBtn")
        time.sleep(0.3)
        count_expanded = page.locator("#productGrid .product-card").count()
        assert count_expanded == 21, f"Expected 21 expanded, got {count_expanded}"
        
        btn_hidden = page.locator("#catalogPagination").is_hidden()
        assert btn_hidden, "Pagination container must be hidden after expansion"

        # 4. Search across all products
        page.fill("#searchInput", "shokolad")
        time.sleep(0.3)
        count_search = page.locator("#productGrid .product-card").count()
        assert count_search == 1, f"Expected 1 match for 'shokolad', got {count_search}"

        # 5. Clear search and test Space filter button
        page.fill("#searchInput", "")
        time.sleep(0.2)
        page.locator('[data-space-filter="travertin"]').first.click()
        time.sleep(0.3)
        count_trav = page.locator("#productGrid .product-card").count()
        assert count_trav == 6, f"Expected 6 travertin products, got {count_trav}"

        # 6. Test Texture tab switching
        page.click('[data-texture="ottocento"]')
        time.sleep(0.3)
        title = page.locator("#textureTitle").text_content().strip()
        assert "Ottocento" in title, f"Expected Ottocento texture, got {title}"

        # 7. Test Theme switcher
        page.click("#themeBtn")
        time.sleep(0.3)
        theme = page.evaluate("() => document.documentElement.getAttribute('data-theme')")
        assert theme == "light", f"Expected light theme, got {theme}"

        browser.close()
        print("[OK] ALL INTERACTIVE FLOWS PASSED PERFECTLY!")

if __name__ == "__main__":
    test()
