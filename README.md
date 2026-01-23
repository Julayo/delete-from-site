# DELETE FROM — Sitio web estático

## Arquitectura elegida
**Opción A (sitio estático)**. Motivos:
- Más simple y rápido de mantener.
- Portátil entre S3+CloudFront, Vercel u otro hosting.
- Menos dependencias y menor lock-in.
- Excelente performance con HTML/CSS/JS puros.

## Sitemap
- Home: `/index.html`
- Servicios: `/servicios.html`
- Casos/Portfolio: `/portfolio.html`
- Proceso: `/proceso.html`
- Pricing: `/pricing.html`
- Contacto: `/contacto.html`
- Aviso de privacidad: `/privacy.html`
- 404: `/404.html`
- EN base: `/en/index.html` (estructura lista para traducir)

## Configuración de API (AWS)
Edita `app.js` y pega tus endpoints reales:

```js
const CONFIG = {
  CONTACT_API_URL: "https://zcrpvb8zn1.execute-api.us-west-2.amazonaws.com/prod/contact",
  ADMIN_API_URL: "https://zcrpvb8zn1.execute-api.us-west-2.amazonaws.com/prod/leads",
  // ...
};
```

### CORS (Lambda contact)
Lambda: `delete-from-mail-sender`
En tu Lambda `delete-from-mail-sender`, configura `ALLOWED_ORIGINS` con tu dominio, por ejemplo:
- `https://delete-from.com`
- `https://www.delete-from.com`
Stage actual: `/prod` en API Gateway.

### Seguridad adicional sugerida
- Rate limiting en API Gateway o WAF para frenar abusos.
- reCAPTCHA/Turnstile opcional si notas spam (no obligatorio).

### Lectura de leads (Lambda admin)
Lambda: `deletefrom_list_leads`
Ejemplo de `curl` (no incluir tokens en frontend):

```bash
curl -H "x-admin-token: TU_TOKEN" \
  "https://zcrpvb8zn1.execute-api.us-west-2.amazonaws.com/prod/leads?limit=50"
```

## Deploy en S3 + CloudFront (recomendado)
1) Crea un bucket S3 (hosting estático) y sube todos los archivos del directorio.
2) Configura `index.html` como documento principal y `404.html` (opcional).
3) Crea una distribución CloudFront con el bucket como origen.
4) Apunta tu dominio con un alias en CloudFront (Route 53 o DNS externo).
5) Habilita HTTPS con ACM.

Alternativa rápida: subir el contenido a Vercel o cualquier hosting estático.

## Estructura para EN (opcional)
Ya existe una estructura base en `/en/` con enlaces, estilos y formulario.
Puedes completar la traduccion y ampliar con contenido real.

## Checklist final
- SEO: `title`, `meta description`, `og:*`, `sitemap.xml`, `robots.txt`.
- Performance: imágenes optimizadas, lazy load si agregas media.
- Accesibilidad: labels visibles, contraste, foco y `aria-live`.
- Analítica: agregar Plausible o GA4 (script en `<head>`).

## Archivos principales
- `index.html`
- `servicios.html`
- `portfolio.html`
- `proceso.html`
- `pricing.html`
- `contacto.html`
- `privacy.html`
- `404.html`
- `styles.css`
- `app.js`
- `sitemap.xml`
- `robots.txt`

## Scripts utiles
- `scripts/health-check.sh` para validar CORS y POST del formulario.
