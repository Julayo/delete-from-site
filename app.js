const CONFIG = {
  CONTACT_API_URL: "https://zcrpvb8zn1.execute-api.us-west-2.amazonaws.com/prod/contact",
  ADMIN_API_URL: "https://zcrpvb8zn1.execute-api.us-west-2.amazonaws.com/prod/leads",
  MAX_MESSAGE_LENGTH: 1200,
  REQUEST_TIMEOUT_MS: 12000,
};

const form = document.querySelector("#contact-form");
const statusEl = document.querySelector("#form-status");
const submitBtn = document.querySelector("#form-submit");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!statusEl || !submitBtn) {
      return;
    }

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      lang: String(formData.get("lang") || "es").trim(),
      topic: String(formData.get("topic") || "general").trim(),
      company: String(formData.get("company") || "").trim(),
    };

    const validationError = validatePayload(payload);
    if (validationError) {
      statusEl.textContent = validationError;
      statusEl.style.color = "#fca5a5";
      return;
    }

    setLoading(true);
    statusEl.textContent = "Enviando tu mensaje...";
    statusEl.style.color = "#9fb0c6";

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
      statusEl.textContent = "Listo. Te respondemos en menos de 24 horas hábiles.";
      statusEl.style.color = "#5eead4";
    } catch (error) {
      statusEl.textContent = "No pudimos enviar el mensaje. Intenta nuevamente en unos minutos.";
      statusEl.style.color = "#fca5a5";
    } finally {
      setLoading(false);
    }
  });
}

function validatePayload(payload) {
  if (!payload.name) {
    return "Por favor indica tu nombre.";
  }
  if (!payload.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) {
    return "Indica un email válido.";
  }
  if (!payload.message) {
    return "Cuéntanos brevemente lo que necesitas.";
  }
  if (payload.message.length > CONFIG.MAX_MESSAGE_LENGTH) {
    return `El mensaje debe tener máximo ${CONFIG.MAX_MESSAGE_LENGTH} caracteres.`;
  }
  return "";
}

function setLoading(isLoading) {
  if (!submitBtn) {
    return;
  }
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Enviando..." : "Enviar";
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
