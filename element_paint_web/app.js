"use strict";

const products = window.PRODUCTS;
const $ = (id) => document.getElementById(id);
const state = {
  category: "all",
  brand: "all",
  query: "",
  expanded: false,
};
const INITIAL_LIMIT = 8;
const TELEGRAM_CHANNEL = "https://t.me/Elementpaint_uzbekistan";
const categoryNames = {
  travertin: "Dekorativ qoplama",
  emal: "Emal bo‘yoq",
  lak: "Himoyalovchi lak",
  primer: "Grunt va yelim",
};

const normalize = (value) =>
  String(value || "")
    .toLocaleLowerCase("uz")
    .replace(/[‘’ʻʼ`'\u02BB\u02BC\u2018\u2019\u201A\u201B]/g, "")
    .normalize("NFKC");

// Theme choice applies to the current visit; a reload starts in morning mode.
const themeButton = $("themeBtn");
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === "dark";
  themeButton.innerHTML = dark
    ? '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>'
    : '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 15.3A8.5 8.5 0 0 1 8.7 4a8.5 8.5 0 1 0 11.3 11.3Z"/></svg>';
  themeButton.setAttribute(
    "aria-label",
    dark ? "Yorug‘ rejimni yoqish" : "Tungi rejimni yoqish",
  );
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.content = dark ? "#24343c" : "#f6efdf";
  }
}

themeButton.addEventListener("click", () => {
  const theme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  updateThemeButton();
});
updateThemeButton();

// Responsive Mobile Menu
const menu = $("navLinks");
function closeMenu() {
  menu.classList.remove("open");
  $("menuBtn").setAttribute("aria-expanded", "false");
  $("menuBtn").setAttribute("aria-label", "Menyuni ochish");
}

$("menuBtn").addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  $("menuBtn").setAttribute("aria-expanded", String(open));
  $("menuBtn").setAttribute(
    "aria-label",
    open ? "Menyuni yopish" : "Menyuni ochish",
  );
});

menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    closeMenu();
  }),
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.classList.contains("open")) {
    closeMenu();
    $("menuBtn").focus();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".navigation")) closeMenu();
});
window.matchMedia("(min-width: 1181px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

// Scroll-spy active link indicator
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main > section[id]");

if ("IntersectionObserver" in window && sections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === `#${id}`);
            if (href === `#${id}`) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }
      });
    },
    { rootMargin: "-25% 0px -65% 0px" },
  );

  sections.forEach((sec) => observer.observe(sec));
}

// Year in footer
if ($("year")) $("year").textContent = new Date().getFullYear();

// Counter
if ($("totalCount")) $("totalCount").textContent = products.length;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

const ARROW_ICON = '<svg class="arrow-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6M6 6h12v12"/></svg>';

// Product Card Builder
function productCard(product) {
  const card = element("article", "product-card");
  card.dataset.brand = product.brand;
  card.dataset.category = product.cat;

  const button = element("button", "product-open");
  button.type = "button";
  button.setAttribute(
    "aria-label",
    `${product.brand} ${product.title} haqida batafsil ma’lumot`,
  );

  const picture = element("div", "product-media");
  const img = element("img");
  Object.assign(img, {
    src: product.img,
    alt: product.title,
    loading: "lazy",
    width: 1122,
    height: 1402,
  });

  const arrow = element("span", "product-arrow");
  arrow.innerHTML = ARROW_ICON;
  arrow.setAttribute("aria-hidden", "true");
  picture.append(img, element("span", "product-tag", categoryNames[product.cat]), arrow);

  const copy = element("div", "product-copy");
  copy.append(
    element("div", "product-brand", product.brand),
    element("h3", "", product.title),
    element("p", "", product.subtitle),
    element("span", "product-detail-link", "Batafsil ko‘rish"),
  );

  copy.querySelector(".product-detail-link").insertAdjacentHTML("beforeend", ARROW_ICON);
  button.append(picture, copy);
  button.addEventListener("click", () => openProduct(product, button));
  card.append(button);
  return card;
}

// Catalog Filter, Search & Compact Pagination Logic
function renderProducts() {
  const query = normalize(state.query.trim());
  const filtered = products.filter(
    (p) =>
      (state.category === "all" || p.cat === state.category ||
        (state.category === "protection" && ["emal", "lak"].includes(p.cat))) &&
      (state.brand === "all" || p.brand === state.brand) &&
      normalize(
        [p.title, p.brand, p.subtitle, p.desc, ...p.specs.flat()].join(" "),
      ).includes(query),
  );

  const displayList = state.expanded
    ? filtered
    : filtered.slice(0, INITIAL_LIMIT);

  $("productGrid").replaceChildren(...displayList.map(productCard));
  $("resultCount").textContent =
    `${filtered.length} ta mahsulot / jami ${products.length}`;
  $("emptyState").hidden = filtered.length > 0;

  // Pagination button
  const paginationContainer = $("catalogPagination");
  const loadMoreBtn = $("loadMoreBtn");
  if (paginationContainer && loadMoreBtn) {
    if (filtered.length > INITIAL_LIMIT && !state.expanded) {
      paginationContainer.hidden = false;
      const remaining = filtered.length - INITIAL_LIMIT;
      loadMoreBtn.textContent = `Yana ${remaining} ta mahsulotni ko‘rsatish ↓`;
    } else {
      paginationContainer.hidden = true;
    }
  }

  document.querySelectorAll("[data-filter]").forEach((button) => {
    const active = button.dataset.filter === state.category;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

const loadMoreBtn = $("loadMoreBtn");
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    state.expanded = true;
    renderProducts();
    $("productGrid").querySelectorAll(".product-open")[INITIAL_LIMIT]?.focus({ preventScroll: true });
  });
}

document.querySelectorAll("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    state.category = button.dataset.filter;
    state.expanded = false;
    renderProducts();
  }),
);

$("searchInput").addEventListener("input", (event) => {
  state.query = event.target.value;
  state.expanded = false;
  renderProducts();
});

$("brandFilter").addEventListener("change", (event) => {
  state.brand = event.target.value;
  state.expanded = false;
  renderProducts();
});

$("resetFilters").addEventListener("click", () => {
  Object.assign(state, {
    category: "all",
    brand: "all",
    query: "",
    expanded: false,
  });
  $("brandFilter").value = "all";
  $("searchInput").value = "";
  renderProducts();
  $("searchInput").focus();
});

document.querySelectorAll("[data-brand-link]").forEach((link) =>
  link.addEventListener("click", () => {
    Object.assign(state, {
      category: "all",
      brand: link.dataset.brandLink,
      query: "",
      expanded: false,
    });
    $("brandFilter").value = state.brand;
    $("searchInput").value = "";
    renderProducts();
  }),
);

// Space Cards click handler (Quick Category Filter)
document.querySelectorAll("[data-space-filter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.spaceFilter;
    state.category = filter;
    state.brand = "all";
    state.query = btn.dataset.productQuery || "";
    state.expanded = false;
    $("brandFilter").value = "all";
    $("searchInput").value = state.query;
    renderProducts();
    const target = $("products");
    if (target) {
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  });
});

// Texture Explorer Logic
const textureData = {
  travertin: {
    eyebrow: "MINERAL TEKSTURA",
    title: "Tabiiy travertin relyefi",
    desc: "Haqiqiy travertin toshining nafis g‘ovakdorligi va tabiiy qatlamlarini aks ettiradi. Fasadlarda jazirama va sovuqqa o‘ta chidamli bo‘lib, bino yuzasiga monolit tosh ulug‘vorligini bag‘ishlaydi.",
    img: "assets/texture_travertine.jpg",
    alt: "Travertin mineral relyefi makro ko‘rinishi",
    filter: "travertin",
    specs: [
      ["Qo‘llanishi", "Fasad va me’moriy interyer"],
      ["Effekt", "3D relyefli, g‘ovak tosh fakturasi"],
      ["Chidamlilik", "Suvga, quyoshga va sovuqqa bardoshli"],
    ],
  },
  ottocento: {
    eyebrow: "DEKORATIV PARDOZ",
    title: "Ottocento ipak va baxmal jilosi",
    desc: "Italiya mumtoz uslubidagi nozik ipak tovlanishi. Xona yoritilish burchagiga qarab sirt rangi mayin o‘zgaradi, devorlarga baxmaldek yumshoq va boy atmosfera beradi.",
    img: "assets/texture_ottocento.jpg",
    alt: "Ottocento ipak va baxmal jilosi makro ko‘rinishi",
    filter: "travertin",
    query: "ottocento",
    specs: [
      ["Qo‘llanishi", "Yotoqxona, zal, premium interyer"],
      ["Effekt", "Ipak jiloli baxmal tovlanish"],
      ["Xavfsizlik", "Suv asosli, hidsiz va ekologik toza"],
    ],
  },
  enamel: {
    eyebrow: "HIMOYALOVCHI EMAL",
    title: "Oyna silliqligidagi yaltiroq emal",
    desc: "Silliq, oyna kabi porloq va suv o‘tkazmaydigan qatlam hosil qiladi. Yog‘och, metall va beton yuzalarni korroziya, tirnalish hamda ultrabinafsha nurlardan ishonchli himoya qiladi.",
    img: "assets/texture_enamel.jpg",
    alt: "Yaltiroq emal qoplamasi makro ko‘rinishi",
    filter: "emal",
    specs: [
      ["Qo‘llanishi", "Eshik, rom, mebel va metall konstruksiyalar"],
      ["Effekt", "Yuqori darajadagi yaltiroq jilo"],
      ["Himoya", "Korroziya va namlikka mutlaq chidamli"],
    ],
  },
};

const textureTabs = [...document.querySelectorAll(".texture-tab")];
textureTabs.forEach((tab, index) => {
  tab.addEventListener("keydown", (event) => {
    let next;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % textureTabs.length;
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index + textureTabs.length - 1) % textureTabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = textureTabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      textureTabs[next].click();
      textureTabs[next].focus();
    }
  });
  tab.addEventListener("click", () => {
    const key = tab.dataset.texture;
    const data = textureData[key];
    if (!data) return;

    document.querySelectorAll(".texture-tab").forEach((t) => {
      const active = t === tab;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
    });
    $("panel-texture").setAttribute("aria-labelledby", tab.id);

    const img = $("textureImg");
    if (img) {
      img.src = data.img;
      img.alt = data.alt;
    }

    if ($("textureEyebrow")) $("textureEyebrow").textContent = data.eyebrow;
    if ($("textureTitle")) $("textureTitle").textContent = data.title;
    if ($("textureDesc")) $("textureDesc").textContent = data.desc;

    const specsList = $("textureSpecs");
    if (specsList) {
      specsList.replaceChildren(
        ...data.specs.map(([k, v]) => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${k}:</strong> ${v}`;
          return li;
        }),
      );
    }

    const actionBtn = $("textureActionBtn");
    if (actionBtn) {
      actionBtn.dataset.spaceFilter = data.filter;
      actionBtn.dataset.productQuery = data.query || "";
    }
  });
});

renderProducts();

// Product Detail Modal Dialog with Focus Management
const dialog = $("productDialog");
let selectedProduct = null;
let lastFocusedElement = null;

function openProduct(product, triggerButton) {
  lastFocusedElement = triggerButton || document.activeElement;
  selectedProduct = product;

  $("modalImg").src = product.img;
  $("modalImg").alt = product.title;
  $("modalBrand").textContent = product.brand;
  $("modalTitle").textContent = product.title;
  $("modalDesc").textContent = product.desc;
  $("copyStatus").textContent = "";

  if ($("modalTgBtn")) {
    $("modalTgBtn").href = TELEGRAM_CHANNEL;
  }

  const rows = product.specs.map(([key, value]) => {
    const row = element("tr");
    const heading = element("th", "", key);
    heading.scope = "row";
    row.append(heading, element("td", "", value));
    return row;
  });

  $("modalSpecs")
    .querySelector("tbody")
    .replaceChildren(...rows);

  dialog.showModal();
  document.body.classList.add("dialog-open");
  $("closeDialog").focus();
}

$("heroProductBtn").addEventListener("click", (event) => {
  const product = products.find((item) => item.id === "ep-travertin");
  if (product) openProduct(product, event.currentTarget);
});

document.querySelectorAll("[data-featured-product]").forEach((button) => {
  button.addEventListener("click", () => {
    const product = products.find((item) => item.id === button.dataset.featuredProduct);
    if (product) openProduct(product, button);
  });
});

$("closeDialog").addEventListener("click", () => dialog.close());

dialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
});

// Close when clicking dialog backdrop
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const inside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;
  if (!inside) dialog.close();
});

$("copyProduct").addEventListener("click", async () => {
  if (!selectedProduct) return;
  const text = `Assalomu alaykum! Element Paint katalogidan "${selectedProduct.brand} — ${selectedProduct.title}" mahsuloti bo‘yicha batafsil ma’lumot va narxini bilmoqchiman.`;
  try {
    await navigator.clipboard.writeText(text);
    $("copyStatus").textContent = "✓ Nusxalandi";
  } catch {
    $("copyStatus").textContent = "Nusxalab bo‘lmadi";
  }
});

// Paint Usage Calculator
const rates = {
  travertin: { coverage: 14, unit: "chelak (25 kg)", primer: 0.05, varnish: 0.1 },
  ottocento: { coverage: 25, unit: "chelak", primer: 0.04, varnish: 0 },
  enamel: { coverage: 9, unit: "kg", primer: 0, varnish: 0 },
  primer: { coverage: 45, unit: "kg", primer: 0, varnish: 0 },
};

const surfaceNames = {
  travertin: "Suyuq travertin (25 kg)",
  ottocento: "Ottocento ipak jilo",
  enamel: "PF-115 emal bo‘yoq",
  primer: "Astar (Gruntovka) konsentrati",
};
let calculationMessage = "";

$("copyCalculation").addEventListener("click", async () => {
  if (!calculationMessage) return;
  try {
    await navigator.clipboard.writeText(calculationMessage);
    $("calcCopyStatus").textContent = "✓ Hisob nusxalandi";
  } catch {
    $("calcCopyStatus").textContent = "Nusxalab bo‘lmadi. Telefon orqali maslahat olishingiz mumkin.";
  }
});

function calculatePaint() {
  $("calcCopyStatus").textContent = "";
  const area = $("calcArea").valueAsNumber;
  const layers = Number($("calcLayers").value);
  const valid = Number.isFinite(area) && area >= 1 && area <= 10000;

  $("calcArea").setAttribute("aria-invalid", String(!valid));
  $("calcError").textContent = valid
    ? ""
    : "1 dan 10 000 m² gacha bo‘lgan maydonni kiriting.";

  const surfaceKey = $("calcSurface").value;
  const rate = rates[surfaceKey] || rates.travertin;
  const surfaceTitle = surfaceNames[surfaceKey] || surfaceKey;
  $("resUnit").textContent = rate.unit;

  if (!valid) {
    calculationMessage = "";
    $("copyCalculation").disabled = true;
    ["resAmount", "resArea", "resLayers", "resPrimer", "resVarnish"].forEach(
      (id) => ($(id).textContent = "—"),
    );
    if ($("calcTgBtn")) $("calcTgBtn").href = TELEGRAM_CHANNEL;
    return;
  }

  const amount = Math.ceil((area * layers) / rate.coverage);
  const primerText = rate.primer
    ? `${Math.ceil(area * rate.primer)} kg`
    : "Qo‘shimcha hisoblanmaydi";
  const varnishText = rate.varnish
    ? `${Math.ceil(area * rate.varnish)} litr`
    : "Hisoblanmaydi";

  $("resAmount").textContent = amount;
  $("resArea").textContent = `${area.toLocaleString("uz")} m²`;
  $("resLayers").textContent = `${layers} qatlam`;
  $("resPrimer").textContent = primerText;
  $("resVarnish").textContent = varnishText;
  $("copyCalculation").disabled = false;

  if ($("calcTgBtn")) {
    calculationMessage =
      `Assalomu alaykum! Element Paint kalkulyatorida hisobladim:\n` +
      `• Mahsulot turi: ${surfaceTitle}\n` +
      `• Maydon: ${area.toLocaleString("uz")} m²\n` +
      `• Qatlamlar: ${layers} qatlam\n` +
      `• Taxminiy sarf: ${amount} ${rate.unit}\n` +
      `• Astar (grunt): ${primerText}\n` +
      `• Lak: ${varnishText}\n\n` +
      `Iltimos, narx va yetkazib berish bo‘yicha maslahat bersangiz.`;
    $("calcTgBtn").href = TELEGRAM_CHANNEL;
  }
}

$("calcForm").addEventListener("submit", (event) => event.preventDefault());
$("calcForm").addEventListener("input", calculatePaint);
$("calcForm").addEventListener("change", calculatePaint);
calculatePaint();
