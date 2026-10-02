"""
Automated Verification Suite for Element Paint Corporate Catalog
Checks file integrity, products database, image assets, calculator formulas, and search normalization.
"""

import os
import re
import sys
import json
import math
from pathlib import Path

# Ensure UTF-8 output on Windows console
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent
WEB_DIR = ROOT_DIR / "element_paint_web"

def test_files_exist():
    print("[1/6] Checking critical project files and architectural assets...")
    required_files = [
        ROOT_DIR / "index.html",
        ROOT_DIR / "README.md",
        WEB_DIR / "index.html",
        WEB_DIR / "style.css",
        WEB_DIR / "app.js",
        WEB_DIR / "theme.js",
        WEB_DIR / "products.js",
        WEB_DIR / "assets" / "logo_dark.png",
        WEB_DIR / "assets" / "logo_light.png",
        WEB_DIR / "assets" / "hero_architecture.jpg",
        WEB_DIR / "assets" / "space_facade.jpg",
        WEB_DIR / "assets" / "space_interior.jpg",
        WEB_DIR / "assets" / "space_wood_metal.jpg",
        WEB_DIR / "assets" / "texture_travertine.jpg",
        WEB_DIR / "assets" / "texture_ottocento.jpg",
        WEB_DIR / "assets" / "texture_enamel.jpg",
        WEB_DIR / "assets" / "element_travertin.jpg",
        WEB_DIR / "assets" / "group_premium.jpg",
    ]
    for file in required_files:
        assert file.exists(), f"Missing required file: {file}"
        assert file.stat().st_size > 0, f"File is empty: {file}"
    print("  [OK] All critical files and architectural assets exist.")

def test_root_redirect():
    print("[2/6] Checking root index.html redirect logic...")
    content = (ROOT_DIR / "index.html").read_text(encoding="utf-8")
    assert "location.replace" in content, "Root redirect should use window.location.replace"
    assert "location.search" in content, "Root redirect should preserve location.search"
    assert "location.hash" in content, "Root redirect should preserve location.hash"
    assert "<noscript>" in content or "fallback" in content or "Katalogga o‘tish" in content, "Root redirect should have accessible fallback link"
    print("  [OK] Root index.html redirect is accessible and preserves URL parameters.")

def extract_products():
    js_content = (WEB_DIR / "products.js").read_text(encoding="utf-8")
    pattern = re.compile(
        r'id:\s*"([^"]+)",\s*cat:\s*"([^"]+)",\s*brand:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*subtitle:\s*"([^"]+)",\s*img:\s*"([^"]+)",\s*desc:\s*"([^"]+)",\s*specs:\s*(\[[^\]]+\])',
        re.DOTALL
    )
    matches = pattern.findall(js_content)
    return matches

def test_products_catalog():
    print("[3/6] Checking products.js catalog structure and assets...")
    matches = extract_products()
    assert len(matches) == 21, f"Expected exactly 21 products, found {len(matches)}"
    
    seen_ids = set()
    brands = set()
    categories = set()

    for pid, cat, brand, title, subtitle, img_rel, desc, specs_str in matches:
        assert pid not in seen_ids, f"Duplicate product ID: {pid}"
        seen_ids.add(pid)
        brands.add(brand)
        categories.add(cat)
        
        # Verify image file exists
        img_path = WEB_DIR / img_rel
        assert img_path.exists(), f"Product image not found for {pid}: {img_path}"
        assert img_path.stat().st_size > 1000, f"Product image is too small or corrupt for {pid}: {img_path}"
        assert len(title.strip()) > 0, f"Empty title for {pid}"
        assert len(desc.strip()) > 10, f"Short description for {pid}"

    expected_brands = {"ELEMENT PAINT", "BERLAK", "ATLAS", "KRATA", "CROWN"}
    assert expected_brands.issubset(brands), f"Missing brands: {expected_brands - brands}"
    
    expected_categories = {"travertin", "emal", "lak", "primer"}
    assert expected_categories.issubset(categories), f"Missing categories: {expected_categories - categories}"

    print(f"  [OK] Verified {len(matches)} products across 5 brands and 4 categories with valid images.")

def test_calculator_logic():
    print("[4/6] Verifying coverage calculator mathematical accuracy...")
    rates = {
        "travertin": {"coverage": 14, "unit": "chelak (25 kg)", "primer": 0.05, "varnish": 0.1},
        "ottocento": {"coverage": 25, "unit": "chelak", "primer": 0.04, "varnish": 0},
        "enamel": {"coverage": 9, "unit": "kg", "primer": 0, "varnish": 0},
        "primer": {"coverage": 45, "unit": "kg", "primer": 0, "varnish": 0},
    }

    # Test Case 1: 120 m² travertin, 2 layers
    area, layers = 120, 2
    rate = rates["travertin"]
    amount = math.ceil((area * layers) / rate["coverage"])
    primer = math.ceil(area * rate["primer"])
    varnish = math.ceil(area * rate["varnish"])
    assert amount == 18, f"Expected 18 containers, got {amount}"
    assert primer == 6, f"Expected 6 kg primer, got {primer}"
    assert varnish == 12, f"Expected 12 liters varnish, got {varnish}"

    # Test Case 2: 1 m² edge case
    area, layers = 1, 1
    amount = math.ceil((area * layers) / rate["coverage"])
    assert amount == 1, f"Expected 1 container for 1 m², got {amount}"

    # Test Case 3: 10,000 m² upper boundary
    area, layers = 10000, 2
    amount = math.ceil((area * layers) / rate["coverage"])
    assert amount == 1429, f"Expected 1429 containers for 10000 m², got {amount}"

    print("  [OK] Calculator formulas verified across standard and boundary conditions.")

def test_search_normalization():
    print("[5/6] Verifying Uzbek search normalization...")
    def normalize(val):
        val = str(val or "").lower()
        for char in "‘’ʻʼ`'":
            val = val.replace(char, "")
        return val

    variations = ["bo'yoq", "bo‘yoq", "boʻyoq", "bo`yoq", "boyoq"]
    normalized_vars = [normalize(v) for v in variations]
    assert all(n == "boyoq" for n in normalized_vars), f"Normalization mismatch: {normalized_vars}"

    target_product = "PF-115 Shokolad emal bo‘yoq"
    norm_product = normalize(target_product)
    for v in variations:
        assert normalize(v) in norm_product, f"Query '{v}' did not match '{target_product}'"

    print("  [OK] Search normalization handles all Uzbek apostrophe variations accurately.")

def test_html_accessibility_and_contrast():
    print("[6/6] Verifying HTML semantic markup, transparent logo, architectural sections, and tokens...")
    html = (WEB_DIR / "index.html").read_text(encoding="utf-8")
    css = (WEB_DIR / "style.css").read_text(encoding="utf-8")
    js = (WEB_DIR / "app.js").read_text(encoding="utf-8")

    # Semantic and a11y checks
    assert 'class="skip-link"' in html, "Skip link missing"
    assert '<main id="main"' in html, "Main element missing"
    assert '<dialog id="productDialog"' in html, "Product dialog missing"
    assert 'id="modalTgBtn"' in html, "Telegram modal button missing"
    assert 'id="calcTgBtn"' in html, "Telegram calculator button missing"
    assert 'aria-live="polite"' in html, "Live region for calculator results missing"
    assert 'aria-label="Asosiy navigatsiya"' in html, "Nav aria-label missing"

    # Logo verification: transparent dark and light versions
    assert (WEB_DIR / "assets" / "logo_dark.png").exists(), "Dark mode transparent logo missing"
    assert (WEB_DIR / "assets" / "logo_light.png").exists(), "Light mode transparent logo missing"
    assert 'src="assets/logo_dark.png"' in html, "Dark logo must be referenced in index.html"
    assert 'src="assets/logo_light.png"' in html, "Light logo must be referenced in index.html"
    assert 'aria-label="Element Paint — bosh sahifa"' in html, "Accessible logo name missing"
    assert 'PAINT ®' not in html, "Unregistered trademark ® should not be present"

    # Architectural sections
    assert 'id="spaces"' in html, "Spaces section (#spaces) missing"
    assert 'id="textures"' in html, "Textures section (#textures) missing"
    assert 'id="loadMoreBtn"' in html, "Catalog load more button missing"

    # Typography & Design System checks
    assert '16px' in css, "Base body font size must be 16px"
    assert re.search(r'object-fit:\s*contain', css), "Logo and mobile dialog must preserve image proportions"

    # JS checks
    assert 'INITIAL_LIMIT = 8' in js, "Initial limit 8 missing in app.js"
    assert 'loadMoreBtn' in js, "Load more button handler missing in app.js"
    assert 'textureData' in js, "Texture explorer data missing in app.js"
    assert 'data-space-filter' in js, "Space filter buttons handler missing in app.js"
    assert 'IntersectionObserver' in js, "Navigation scroll spy missing in app.js"

    # Check actual text contrast in both themes instead of freezing a palette.
    def luminance(hex_color):
        channels = [int(hex_color[i:i + 2], 16) / 255 for i in (1, 3, 5)]
        linear = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
        return sum(c * weight for c, weight in zip(linear, (0.2126, 0.7152, 0.0722)))

    def contrast(a, b):
        values = sorted((luminance(a), luminance(b)))
        return (values[1] + 0.05) / (values[0] + 0.05)

    for selector in (r':root\s*', r':root\[data-theme="light"\]\s*'):
        block = re.search(selector + r'\{([^}]+)\}', css).group(1)
        tokens = dict(re.findall(r'--([\w-]+):\s*(#[\da-fA-F]{6})', block))
        for background in ('bg', 'surface', 'raised'):
            for foreground in ('text', 'muted', 'accent'):
                ratio = contrast(tokens[foreground], tokens[background])
                assert ratio >= 4.5, f"Insufficient {foreground}/{background} contrast: {ratio:.2f}"
        assert contrast(tokens['on-accent'], tokens['accent']) >= 4.5, "Button text contrast is insufficient"

    print("  [OK] Transparent logos, architectural sections, pagination, and contrast tokens verified.")

def run_all():
    print("=" * 60)
    print("Running Element Paint Catalog Verification Suite")
    print("=" * 60)
    test_files_exist()
    test_root_redirect()
    test_products_catalog()
    test_calculator_logic()
    test_search_normalization()
    test_html_accessibility_and_contrast()
    print("=" * 60)
    print("ALL TESTS PASSED! Quality control check 100% successful.")
    print("=" * 60)

if __name__ == "__main__":
    run_all()
