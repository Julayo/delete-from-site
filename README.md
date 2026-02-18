# DELETE-FROM LABS — Sitio web

## Decisión de stack

**Sitio estático puro** (HTML / CSS / JS vanilla).

Evaluado vs. Next.js/React y descartado por:
- El sitio es un brochure + catálogo de tools. Sin lógica de cliente compleja.
- Deploy directo a S3 + CloudFront sin paso de build. Cero overhead.
- Máxima portabilidad: funciona en Vercel, Netlify, GitHub Pages o cualquier hosting.
- Sin lock-in de framework. El sitio puede ser mantenido por cualquier dev.
- Lighthouse score ≥ 95 en producción sin optimizaciones adicionales.

Si en el futuro el catálogo de tools crece significativamente o se añade auth/dashboard, migrar a Next.js App Router sería justificado.

---

## Diseño

**Estética:** Clean Lab / Research Studio.
- Fondo claro como defecto (toggle a modo oscuro disponible).
- Acento: teal (`#0D9488`).
- Tipografía: Space Grotesk + Space Mono.
- Sin gradientes pesados, sin neon, sin ruido. Estructura, jerarquía y espacio.

**Modo oscuro:** opt-in via botón en navbar. Se persiste en `localStorage` con clave `df-theme`.

---

## Sitemap

| Ruta | Archivo |
|---|---|
| `/` | `index.html` |
| `/tools` | `tools/index.html` |
| `/tools/<slug>/` | `tools/<slug>/index.html` |
| `/servicios` | `servicios.html` |
| `/portfolio` | `portfolio.html` |
| `/proceso` | `proceso.html` |
| `/pricing` | `pricing.html` |
| `/contacto` | `contacto.html` |
| `/privacy` | `privacy.html` |
| `/404` | `404.html` |

---

## Formulario de contacto (AWS Lambda)

**Endpoint:** `https://zcrpvb8zn1.execute-api.us-west-2.amazonaws.com/prod/contact`

**Lambda:** `delete-from-mail-sender`

**Payload esperado (no modificar):**
```json
{
  "name": "string (opcional)",
  "email": "string (opcional)",
  "message": "string + Categoria: X + Quiere premium: Si/No",
  "lang": "es | en",
  "topic": "devops | aws | terraform | linux | finops | security | other",
  "company": ""
}
```

**Protecciones integradas:**
- Honeypot field (`company`): si llega con valor, se descarta silenciosamente.
- Validación de email con regex.
- Timeout de 12 segundos en fetch.
- Máximo 1200 caracteres en mensaje.

**CORS Lambda:** configura `ALLOWED_ORIGINS` con `https://delete-from.com`.

**Leads admin (no exponer en frontend):**

```

---

## Tools data

Fuente única: `data/tools.json`.

```json
[
  {
    "slug": "aws-cost-snapshot",
    "name": "AWS Cost Snapshot",
    "description": "...",
    "status": "Freemium",
    "tags": ["AWS", "FinOps"],
    "links": { "docs": "#", "download": "#" },
    "quickstart": ["Paso 1", "Paso 2"],
    "pricing": {
      "freeIncludes": ["..."],
      "premiumIncludes": ["..."],
      "starterIdea": "Hosted dashboard"
    }
  }
]
```

**Valores de `status`:** `Free` | `Freemium` | `Premium` | `WIP`

### Agregar una tool

1. Añade el objeto en `data/tools.json`.
2. Genera la página de detalle:
   ```bash
   node scripts/generate-tools-pages.js
   ```
   O copia `tools/aws-cost-snapshot/index.html` → `tools/<slug>/index.html` y ajusta `data-tool-slug` y el `canonical`.

---

## Deploy (S3 + CloudFront)

1. Sube el directorio completo al bucket S3 (excluye `.git`, `.github`, `scripts`, `node_modules`).
2. `index.html` como documento raíz; `404.html` como página de error.
3. Distribución CloudFront con el bucket como origen.
4. Dominio con alias → CloudFront + HTTPS via ACM.

El workflow `.github/workflows/deploy.yml` automatiza esto con OIDC (sin secrets en el repo).

**Bucket:** `delete-from-site` (us-west-2)
**CloudFront:** `E2UN2UG87AFRPM`

---

## Scripts

| Script | Uso |
|---|---|
| `scripts/generate-tools-pages.js` | Genera `tools/<slug>/index.html` desde `data/tools.json` |
| `scripts/health-check.sh` | Valida CORS y POST del formulario de contacto |
| `scripts/oidc-setup.sh` | Configura AWS OIDC para GitHub Actions |

---

## QA checklist

- [x] Responsive (mobile-first, breakpoints 960px / 680px)
- [x] Formulario de contacto funcional (Lambda integration preservada)
- [x] Modo claro por defecto, modo oscuro via toggle
- [x] Accesibilidad: labels, aria-live, focus-visible, contraste WCAG AA
- [x] SEO: title, meta description, og:*, canonical, sitemap.xml, robots.txt
- [x] Sin console errors en producción
- [x] Rutas funcionales (todas las páginas enlazan correctamente)

---

## Archivos principales

```
/
├── index.html
├── styles.css          ← design system completo (tokens, componentes, dark mode)
├── app.js              ← contact form, tools render, theme toggle
├── data/tools.json     ← fuente única de tools
├── tools/              ← catálogo + páginas de detalle
├── assets/             ← logo-mark.svg, logo-full.svg, favicon.svg
├── scripts/            ← utilidades de build y ops
└── .github/workflows/  ← CI/CD deploy
```
