"""Browser checks for responsive layout, navigation and real catalog actions."""
import os
import json
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect

URL = os.environ.get("ELEMENT_PAINT_URL", "http://localhost:8080/")


def test():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900},
                                      permissions=["clipboard-read", "clipboard-write"])
        page = context.new_page()
        errors = []
        failed_assets = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("response", lambda response: failed_assets.append(response.url)
                if response.status >= 400 and urlparse(response.url).netloc == urlparse(URL).netloc else None)
        page.goto(URL + "?review=1#home", wait_until="networkidle")
        assert "?review=1#home" in page.url, "Root redirect must preserve URL parameters"
        expect(page.locator("#productGrid .product-card")).to_have_count(8)

        # Public links must match the verified contact data, including every phone CTA.
        company = json.loads((Path(__file__).resolve().parent.parent /
                              "element_paint_web/element-paint-data.json").read_text(encoding="utf-8"))["company"]
        phone_links = set(page.locator("a[href^='tel:']").evaluate_all("links => links.map(a => a.getAttribute('href'))"))
        assert phone_links == {"tel:+998953003000", "tel:+998999755508"}
        for url in company["links"].values():
            assert page.locator(f"#contact a[href='{url}']").count() > 0, url

        # The featured product is actionable and restores keyboard focus.
        page.locator("#heroProductBtn").click()
        expect(page.locator("#productDialog")).to_be_visible()
        expect(page.locator("#modalTitle")).to_have_text("Premium Suyuq Travertin")
        expect(page.locator("#modalTgBtn")).to_have_attribute("href", company["links"]["telegram"])
        page.locator("#copyProduct").click()
        expect(page.locator("#copyStatus")).to_have_text("✓ Nusxalandi")
        assert "Premium Suyuq Travertin" in page.evaluate("navigator.clipboard.readText()")
        page.keyboard.press("Escape")
        expect(page.locator("#productDialog")).not_to_be_visible()
        expect(page.locator("#heroProductBtn")).to_be_focused()

        # Quick links must actually select the products their labels describe.
        page.locator(".space-card [data-product-query='ottocento']").click()
        expect(page.locator("#productGrid .product-card")).to_have_count(1)
        expect(page.locator("#productGrid h3")).to_contain_text("Ottocento")
        page.locator(".space-card [data-space-filter='protection']").click()
        expect(page.locator("[data-filter='protection']")).to_have_attribute("aria-pressed", "true")
        categories = page.locator("#productGrid .product-card").evaluate_all(
            "cards => cards.map(card => card.dataset.category)")
        assert "emal" in categories and "lak" in categories
        assert set(categories) == {"emal", "lak"}

        # Tabs implement roving focus, keyboard navigation and panel naming.
        page.locator("#tab-travertin").focus()
        page.keyboard.press("ArrowRight")
        expect(page.locator("#tab-ottocento")).to_be_focused()
        expect(page.locator("#panel-texture")).to_have_attribute("aria-labelledby", "tab-ottocento")
        expect(page.locator("#textureImg")).to_have_attribute("src", "assets/texture_ottocento.jpg")
        page.locator("#textureActionBtn").click()
        expect(page.locator("#productGrid .product-card")).to_have_count(1)
        page.locator("#tab-enamel").click()
        page.locator("#tab-travertin").click()
        expect(page.locator("#textureImg")).to_have_attribute("src", "assets/texture_travertine.jpg")

        # Expansion keeps focus on a newly revealed product.
        page.locator("[data-filter='all']").click()
        page.locator("#searchInput").fill("")
        page.locator("#loadMoreBtn").click()
        expect(page.locator("#productGrid .product-card")).to_have_count(20)
        expect(page.locator("#productGrid .product-open").nth(8)).to_be_focused()
        page.locator("#searchInput").fill("zz-no-match")
        expect(page.locator("#emptyState")).to_be_visible()
        page.locator("#resetFilters").click()
        expect(page.locator("#searchInput")).to_be_focused()
        expect(page.locator("#productGrid .product-card")).to_have_count(8)

        # A channel cannot receive a prefilled message: copy the estimate separately.
        page.locator("#calcArea").fill("120")
        page.locator("#calcLayers").select_option("2")
        expect(page.locator("#resAmount")).to_have_text("18")
        expect(page.locator("#calcTgBtn")).to_have_attribute("href", company["links"]["telegram"])
        page.locator("#copyCalculation").click()
        expect(page.locator("#calcCopyStatus")).to_have_text("✓ Hisob nusxalandi")
        assert "18 chelak (25 kg)" in page.evaluate("navigator.clipboard.readText()")
        page.locator("#calcArea").fill("0")
        expect(page.locator("#calcArea")).to_have_attribute("aria-invalid", "true")
        expect(page.locator("#resAmount")).to_have_text("—")
        expect(page.locator("#copyCalculation")).to_be_disabled()
        page.locator("#calcArea").fill("120")

        # Both themes fit the viewport; each reload starts in morning mode.
        for theme in ("light", "dark"):
            if page.locator("html").get_attribute("data-theme") != theme:
                page.locator("#themeBtn").click()
            expect(page.locator("html")).to_have_attribute("data-theme", theme)
            for width in (320, 375, 390, 640, 768, 900, 1024, 1180, 1280, 1440, 1920):
                page.set_viewport_size({"width": width, "height": 900})
                assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), \
                    f"Horizontal overflow at {width}px in {theme} theme"

        page.evaluate("localStorage.setItem('ep_theme', 'dark')")
        page.reload(wait_until="networkidle")
        expect(page.locator("html")).to_have_attribute("data-theme", "light")
        assert page.evaluate("getComputedStyle(document.body).backgroundColor") == "rgb(246, 239, 223)"
        sections = page.locator("main > section[id]").evaluate_all("nodes => nodes.map(n => n.id)")
        assert sections == ["home", "products", "about", "calculator", "textures", "spaces", "contact"]
        assert "KRATA" not in page.locator("body").inner_text()
        assert page.locator("#home img[src*='architecture']").count() == 0
        expect(page.locator("#paintBackground")).to_have_attribute("data-state", "ready")
        page.emulate_media(reduced_motion="reduce")
        expect(page.locator("#paintBackground")).to_have_attribute("data-state", "reduced-motion")
        page.emulate_media(reduced_motion="no-preference")

        # Tablet and phone menus can close by selection, Escape, and outside click.
        for width in (390, 1024):
            page.set_viewport_size({"width": width, "height": 844})
            page.locator("#menuBtn").click()
            expect(page.locator("#menuBtn")).to_have_attribute("aria-expanded", "true")
            page.keyboard.press("Escape")
            expect(page.locator("#menuBtn")).to_be_focused()
            expect(page.locator("#navLinks")).not_to_be_visible()
            page.locator("#menuBtn").click()
            page.locator("#navLinks a[href='#contact']").click()
            expect(page.locator("#menuBtn")).to_have_attribute("aria-expanded", "false")
            page.locator("#menuBtn").click()
            page.mouse.click(10, 830)
            expect(page.locator("#menuBtn")).to_have_attribute("aria-expanded", "false")

        # Make lazy images load and verify they decode, including all product images.
        page.set_viewport_size({"width": 1440, "height": 900})
        page.locator("[data-filter='all']").click()
        page.locator("#loadMoreBtn").click()
        page.evaluate("document.querySelectorAll('img').forEach(img => img.loading = 'eager')")
        page.wait_for_function("[...document.images].filter(i => i.hasAttribute('src')).every(i => i.complete && i.naturalWidth > 0)")
        assert not errors, f"JavaScript errors: {errors}"
        assert not failed_assets, f"Broken local resources: {failed_assets}"
        browser.close()
        print("[OK] Responsive themes, quick filters, keyboard tabs, modal, calculator and image loading passed.")


if __name__ == "__main__":
    test()
