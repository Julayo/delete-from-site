# DELETE-FROM STUDIO — Sitio web

Sitio estático de [delete-from.com](https://delete-from.com).

## Stack

HTML / CSS / JS vanilla. Sin framework, sin paso de build.
Deploy directo a S3 + CloudFront via GitHub Actions (OIDC).

## Estructura

```
/
├── index.html       ← landing del estudio (hero, juegos, manifiesto/about, contacto)
├── devlog.html      ← bitácora de desarrollo (posts del estudio)
├── styles.css       ← design system completo (incluye estilos de devlog)
├── script.js        ← toggle ES/EN (data-i18n), scroll behavior
├── 404.html
├── privacy.html
├── assets/          ← favicon y logos
├── scripts/         ← utilidades de ops (oidc-setup, health-check)
└── .github/
    └── workflows/
        ├── deploy.yml   ← sync S3 + invalidación CloudFront
        └── health.yml
```

> Estudio indie de juegos hecho con **tiempos rescatados de la vida adulta**.
> (Las páginas antiguas de la marca "Labs" —blog/servicios/pricing/tools— se retiraron.)

## Design system

- Fondo: `#0f0f0f`
- Acento: `#7F77DD` (púrpura)
- Fuente títulos: Press Start 2P
- Fuente cuerpo/nav: monospace
- Sin border-radius, sin gradientes, sin sombras — estética pixel/retro

## Bilingüe (ES/EN)

Toggle en navbar. Textos en `script.js` via `data-i18n`. Idioma persiste en `localStorage` clave `df-lang`.

## Deploy

El workflow `deploy.yml` se dispara en push a `main`:
1. Sync al bucket `delete-from-site` (us-west-2)
2. Invalida distribución CloudFront `E2UN2UG87AFRPM`

Sin secretos en el repo — usa OIDC con el role en `secrets.AWS_ROLE_ARN`.

## Participantes

- [@Julayo](https://github.com/Julayo)
