const CONFIG = {
  CONTACT_API_URL: "https://zcrpvb8zn1.execute-api.us-west-2.amazonaws.com/prod/contact",
  ADMIN_API_URL: "https://zcrpvb8zn1.execute-api.us-west-2.amazonaws.com/prod/leads",
  MAX_MESSAGE_LENGTH: 1200,
  REQUEST_TIMEOUT_MS: 12000,
};

const TOOL_STATUS = {
  Free: { label: "Free", className: "badge-free" },
  Freemium: { label: "Freemium", className: "badge-freemium" },
  Premium: { label: "Premium", className: "badge-premium" },
  WIP: { label: "WIP", className: "badge-wip" },
};

const TOOL_DATA_URL = getToolsDataUrl();
let toolsCache = null;

const form = document.querySelector("#contact-form");
const statusEl = document.querySelector("#form-status");
const submitBtn = document.querySelector("#form-submit");

if (form) {
  const defaultSubmitText = submitBtn ? submitBtn.textContent : "";
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!statusEl || !submitBtn) {
      return;
    }

    const formData = new FormData(form);
    const honeypot = String(formData.get("company") || "").trim();

    if (honeypot) {
      form.reset();
      statusEl.textContent = "¡Gracias! Tu idea quedó registrada.";
      statusEl.style.color = "#0D9488";
      return;
    }

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const topic = String(formData.get("topic") || "general").trim();
    const wantsPremium = Boolean(formData.get("premium"));
    const lang = String(formData.get("lang") || "es").trim();

    const validationError = validatePayload({ name, email, message });
    if (validationError) {
      statusEl.textContent = validationError;
      statusEl.style.color = "#DC2626";
      return;
    }

    setLoading(true, defaultSubmitText);
    statusEl.textContent = "Enviando tu idea...";
    statusEl.style.color = "#64748B";

    const enrichedMessage = [
      message,
      "",
      `Categoria: ${topic || "general"}`,
      `Quiere premium: ${wantsPremium ? "Si" : "No"}`,
    ].join("\n");

    const payload = {
      name,
      email,
      message: enrichedMessage,
      lang,
      topic,
      company: "",
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT_MS);

      const response = await fetch(CONFIG.CONTACT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Server error");
      }

      form.reset();
      statusEl.textContent = "Listo. Revisamos tu idea y te respondemos pronto.";
      statusEl.style.color = "#0D9488";
    } catch (error) {
      statusEl.textContent =
        "No pudimos enviar la idea. Intenta nuevamente en unos minutos o escribe a hello@delete-from.com.";
      statusEl.style.color = "#DC2626";
    } finally {
      setLoading(false, defaultSubmitText);
    }
  });
}

function validatePayload(payload) {
  if (!payload.message) {
    return "Cuéntanos qué herramienta te gustaría.";
  }
  if (payload.message.length > CONFIG.MAX_MESSAGE_LENGTH) {
    return `La idea debe tener máximo ${CONFIG.MAX_MESSAGE_LENGTH} caracteres.`;
  }
  if (payload.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) {
    return "Indica un email válido.";
  }
  return "";
}

function setLoading(isLoading, defaultText) {
  if (!submitBtn) {
    return;
  }
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Enviando..." : defaultText;
}

async function loadTools() {
  if (toolsCache) {
    return toolsCache;
  }
  try {
    const response = await fetch(TOOL_DATA_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load tools");
    }
    toolsCache = await response.json();
    return toolsCache;
  } catch (error) {
    return [];
  }
}

function renderToolCard(tool, { compact = false } = {}) {
  const status = TOOL_STATUS[tool.status] || TOOL_STATUS.WIP;
  const tags = Array.isArray(tool.tags) ? tool.tags.join(" · ") : "";
  const buttons = compact
    ? `
      <div class="tool-actions">
        <a class="btn btn-secondary" href="tools/${tool.slug}/">Ver / Descargar</a>
        <a class="btn btn-ghost" href="${tool.links?.docs || "#"}">Docs</a>
      </div>
    `
    : `
      <div class="tool-actions">
        <a class="btn btn-secondary" href="${toolLink(tool.slug)}">Ver / Descargar</a>
        <a class="btn btn-ghost" href="${tool.links?.docs || "#"}">Docs</a>
      </div>
    `;

  return `
    <article class="tool-card" data-status="${tool.status}" data-name="${tool.name}" data-tags="${tool.tags?.join(" ") || ""}">
      <div class="tool-header">
        <div>
          <h3>${tool.name}</h3>
          <p class="section-muted">${tool.description}</p>
        </div>
        <span class="badge ${status.className}">${status.label}</span>
      </div>
      <p class="tool-tags">${tags}</p>
      ${buttons}
    </article>
  `;
}

function toolLink(slug) {
  return `../tools/${slug}/`;
}

async function renderFeaturedTools() {
  const container = document.querySelector("#featured-tools");
  if (!container) {
    return;
  }
  const tools = await loadTools();
  const limit = Number(container.dataset.limit || 6);
  const featured = tools.slice(0, limit);
  container.innerHTML = featured.map((tool) => renderToolCard(tool, { compact: true })).join("");
}

async function renderToolsIndex() {
  const grid = document.querySelector("#tools-grid");
  if (!grid) {
    return;
  }
  const tools = await loadTools();
  grid.innerHTML = tools.map((tool) => renderToolCard(tool)).join("");
  setupToolFilters();
}

function setupToolFilters() {
  const filters = Array.from(document.querySelectorAll("[data-filter]"));
  const searchInput = document.querySelector("#tools-search");
  const emptyState = document.querySelector("#tools-empty");
  let activeFilter = "All";

  const applyFilters = () => {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const cards = Array.from(document.querySelectorAll(".tool-card"));
    let visibleCount = 0;

    cards.forEach((card) => {
      const status = card.dataset.status || "";
      const name = card.dataset.name || "";
      const tags = card.dataset.tags || "";
      const matchesFilter = activeFilter === "All" || status === activeFilter;
      const matchesSearch =
        !query ||
        name.toLowerCase().includes(query) ||
        tags.toLowerCase().includes(query);

      const isVisible = matchesFilter && matchesSearch;
      card.style.display = isVisible ? "flex" : "none";
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount ? "none" : "block";
    }
  };

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      activeFilter = filter.dataset.filter || "All";
      filters.forEach((item) => item.classList.toggle("is-active", item === filter));
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  applyFilters();
}

async function renderToolDetail() {
  const detail = document.querySelector("#tool-detail");
  if (!detail) {
    return;
  }

  const slug = getToolSlug();
  const tools = await loadTools();
  const tool = tools.find((item) => item.slug === slug);
  const empty = document.querySelector("#tool-empty");

  if (!tool) {
    if (empty) {
      empty.style.display = "block";
    }
    detail.style.display = "none";
    return;
  }

  if (empty) {
    empty.style.display = "none";
  }

  const status = TOOL_STATUS[tool.status] || TOOL_STATUS.WIP;
  detail.querySelector("#tool-title").textContent = tool.name;
  detail.querySelector("#tool-description").textContent = tool.description;
  detail.querySelector("#tool-status").textContent = status.label;
  detail.querySelector("#tool-status").className = `badge ${status.className}`;
  detail.querySelector("#tool-tags").textContent = tool.tags?.join(" · ") || "";

  const quickstart = detail.querySelector("#tool-quickstart");
  const quickstartSteps = Array.isArray(tool.quickstart) ? tool.quickstart : [];
  quickstart.innerHTML = quickstartSteps.map((step) => `<li>${step}</li>`).join("");

  const links = detail.querySelector("#tool-links");
  links.innerHTML = `
    <a class="btn btn-secondary" href="${tool.links?.download || "#"}">Ver / Descargar</a>
    <a class="btn btn-ghost" href="${tool.links?.docs || "#"}">Docs</a>
  `;

  const pricingBox = detail.querySelector("#tool-pricing");
  if (tool.status === "Freemium" || tool.status === "Premium") {
    const pricing = tool.pricing || { freeIncludes: [], premiumIncludes: [], starterIdea: "" };
    const freeIncludes = Array.isArray(pricing.freeIncludes) ? pricing.freeIncludes : [];
    const premiumIncludes = Array.isArray(pricing.premiumIncludes) ? pricing.premiumIncludes : [];
    pricingBox.innerHTML = `
      <div class="pricing-card">
        <h3>Pricing</h3>
        <p class="section-muted">Gratis para uso personal + upgrade opcional.</p>
        <div class="pricing-columns">
          <div>
            <h4>Free</h4>
            <ul>
              ${freeIncludes.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
          <div>
            <h4>Premium</h4>
            <ul>
              ${premiumIncludes.map((item) => `<li>${item}</li>`).join("")}
            </ul>
            <p class="section-muted">Idea premium: ${pricing.starterIdea}</p>
          </div>
        </div>
      </div>
    `;
  } else {
    pricingBox.innerHTML = "";
  }
}

function getToolSlug() {
  const explicitSlug = document.body.dataset.toolSlug;
  if (explicitSlug) {
    return explicitSlug;
  }
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("tool");
  if (fromQuery) {
    return fromQuery;
  }
  const parts = window.location.pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  if (last === "index.html" && parts.length > 1) {
    return parts[parts.length - 2];
  }
  return last;
}

function getToolsDataUrl() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts[0] === "tools") {
    if (parts.length === 1) {
      return "../data/tools.json";
    }
    const last = parts[parts.length - 1];
    if (last === "index.html" && parts.length === 2) {
      return "../data/tools.json";
    }
    return "../../data/tools.json";
  }
  return "data/tools.json";
}

function setupThemeToggle() {
  const buttons = Array.from(document.querySelectorAll("[data-theme-toggle]"));
  if (!buttons.length) {
    return;
  }

  const THEME_KEY = "df-theme";
  const saved = (() => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  })();

  const initial = saved || "light";
  applyTheme(initial);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (error) {
        // Ignore storage errors (private mode).
      }
    });
  });

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    });
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Sticky header shadow on scroll
(function () {
  const header = document.querySelector("header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

renderFeaturedTools();
renderToolsIndex();
renderToolDetail();
setupThemeToggle();
