# CI/CD — MediCitas Frontend

Pipeline de integración y despliegue continuo para el frontend (React 19 / Vite / Nginx).
Definido en [`.github/workflows/ci-cd.yml`](../.github/workflows/ci-cd.yml). Mismo diseño que el backend.

## Modelo de ramas

```
feature/*  ──PR──▶  develop  ──PR──▶  staging  ──PR──▶  main
                       │                 │                │
                   solo valida       valida +         valida +
                   (no imagen)       publica imagen   publica imagen
                                     (sin desplegar)  + despliega PROD
```

- **Promoción por artefacto**: la imagen se construye una vez (tag = SHA) y esa misma se despliega.
- Triggers: `push` y `pull_request` sobre `main`, `staging`, `develop`. `concurrency` con `cancel-in-progress`.

## Jobs

| Job | Depende de | Cuándo | Qué hace |
|---|---|---|---|
| `secretos` | — | siempre | Gitleaks |
| `pruebas` | — | siempre | `npm ci` → `lint` → `test:coverage` → `build`; sube cobertura + `dist`; comenta cobertura en PRs |
| `calidad` | `pruebas` | siempre (salvo PRs de Dependabot) | SonarQube self-hosted (lcov) + Quality Gate |
| `dependencias` | `pruebas` | siempre | `npm audit --audit-level=high` + reporte JSON |
| `imagen` | `secretos`, `calidad`, `dependencias` | push a `main`/`staging` | build Vite+Nginx → Trivy → push a GHCR (SHA + rama) |
| `deploy-produccion` | `imagen` | push a `main` | Deploy en Railway con la imagen GHCR → health check → rollback |

## Secrets requeridos

**GitHub → Settings → Secrets and variables → Actions.**

| Secret | De dónde sale |
|---|---|
| `SONAR_HOST_URL` | URL pública de SonarQube (misma instancia que el backend) |
| `SONAR_TOKEN` | Token del proyecto `MedicitasFrontend` en SonarQube |
| `RAILWAY_TOKEN` | Railway → proyecto → Settings → Tokens |
| `RAILWAY_SERVICE` | Nombre del servicio frontend en Railway (ej. `medicitas-front`) |
| `PRODUCTION_URL` | Dominio público del frontend (ej. `https://medicitas-front.lmart.dev`). Opcional al primer deploy |

**Variable de repo (no secret):**

| Variable | Valor | Uso |
|---|---|---|
| `VITE_API_URL` | `https://medicitas-api.lmart.dev/api` | URL del backend, horneada en el build de la imagen |

> `GITHUB_TOKEN` es automático. `packages: write` solo en el job `imagen`.

## SonarQube

- Crear proyecto con key **`MedicitasFrontend`** (coincide con [`sonar-project.properties`](../sonar-project.properties)).
- Cobertura vía `coverage/lcov.info` (Vitest). La cobertura actual es baja: el Quality Gate puede marcar el *código nuevo* — ajusta el gate en Sonar si hace falta.

## Railway

- Servicio **medicitas-front** con **Source: Docker Image** → `ghcr.io/<repo-en-minusculas>/medicitas-front`, leyendo el tag desde `IMAGE_TAG` (el pipeline lo setea con el SHA).
- Imagen privada de GHCR → credenciales (usuario + PAT `read:packages`) o hacer el paquete público.
- **Target port**: `80` (Nginx). Genera dominio o custom domain (Cloudflare, DNS only).
- `PRODUCTION_URL` = ese dominio, tras el primer deploy.

## GitHub Environment `production`

Repo → Settings → Environments → `production` → **Required reviewers** (gate de aprobación manual).

## Desarrollo local

```bash
npm ci
npm run dev                # servidor de desarrollo (Vite)
npm run test:coverage      # tests + cobertura
npm run build              # build de produccion -> dist/
```

Con Docker:
```bash
cp .env.example .env       # ajusta VITE_API_URL
docker compose -f docker-compose.staging.yml up -d --build
curl -I http://localhost:8081        # 200 OK
```

## Notas

- **Cobertura**: umbral informativo (no tumba el build); el gate real es SonarQube.
- **`VITE_API_URL` es build-time**: cambiarla requiere reconstruir la imagen (es estática en el bundle).
- **Dependabot** ([`.github/dependabot.yml`](../.github/dependabot.yml)): npm semanal, actions/docker mensual, agrupados.
