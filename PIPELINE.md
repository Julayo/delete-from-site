# Pipeline (GitHub Actions -> S3)

Este repo despliega a S3 en cada push a `main`.

## Requisitos
1) Crear un role IAM con OIDC para GitHub Actions
2) Configurar secrets en GitHub:
   - `AWS_ROLE_ARN`
   - `CLOUDFRONT_DISTRIBUTION_ID` (opcional)

## Valores actuales
- Bucket: `delete-from-site`
- Region: `us-west-2`
- CloudFront distro: `E2UN2UG87AFRPM`

## OIDC (resumen)
- Proveedor OIDC: `token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`
- Role policy mínima: S3 sync + CloudFront invalidation

## Script automático
Ejecuta el script para crear el provider, policy y role:

```bash
scripts/oidc-setup.sh
```

Luego en GitHub > Settings > Secrets and variables > Actions:
- `AWS_ROLE_ARN` = (output del script)
- `CLOUDFRONT_DISTRIBUTION_ID` = `E2UN2UG87AFRPM`
