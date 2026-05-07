# AI Router Dashboard

Self-hosted dashboard and local gateway for routing AI requests through multiple providers using an OpenAI-compatible API.

## What this repo includes

- Next.js dashboard running on port `20128`
- OpenAI-compatible local API at `http://localhost:20128/v1`
- Provider/account management for local use
- Optional cloud worker support under [`cloud/`](./cloud/README.md)
- Reusable agent skills under [`skills/`](./skills/README.md)
- Test suite for embeddings and cloud behavior under [`tests/`](./tests/README.md)

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

Default URLs:

- Dashboard: `http://localhost:20128/dashboard`
- API: `http://localhost:20128/v1`

Production mode:

```bash
npm run build
npm run start
```

## Example client configuration

Point your CLI or editor plugin to:

- Endpoint: `http://localhost:20128/v1`
- API key: the key generated in the dashboard
- Model: any configured model alias available in your local setup

## Environment notes

Common values you may want to set in `.env`:

- `BASE_URL=http://localhost:20128`
- `NEXT_PUBLIC_BASE_URL=http://localhost:20128`
- `CLOUD_URL=https://your-domain.example`
- `NEXT_PUBLIC_CLOUD_URL=https://your-domain.example`
- `API_KEY_SECRET=change-this-secret`
- `MACHINE_ID_SALT=change-this-salt`

On Windows PowerShell, set temporary values with:

```powershell
$env:NAME="value"
```

## Publishing this fork

Before pushing this project to your GitHub account, review:

- package names in `package.json`, `cloud/package.json`, and `tests/package.json`
- image assets under `images/` and `public/`
- any remaining upstream links or branding outside README files
- `LICENSE` if you want a different license owner line

Repository URL placeholders for your own docs:

```text
https://github.com/<your-account>/<your-repo>
https://raw.githubusercontent.com/<your-account>/<your-repo>/main/...
https://your-domain.example
```

## Project structure

- [`cloud/`](./cloud/README.md): optional Cloudflare Worker deployment
- [`skills/`](./skills/README.md): raw skill documents for agents
- [`tests/`](./tests/README.md): focused test setup and commands
- [`docs/`](./docs): technical notes and architecture material

## License

This repository currently includes the local [`LICENSE`](./LICENSE) file. Review it before publishing so the copyright line matches your intended ownership.
