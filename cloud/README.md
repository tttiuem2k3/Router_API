# Cloud Worker

Optional Cloudflare Worker deployment for exposing the router through your own cloud endpoint.

## Setup

```bash
npm install -g wrangler
wrangler login

cd cloud
npm install

wrangler kv namespace create KV
wrangler d1 create proxy-db
wrangler d1 execute proxy-db --remote --file=./migrations/0001_init.sql
npm run deploy
```

After deployment, copy the Worker URL into the dashboard cloud endpoint settings and enable cloud sync.

## Before publishing

- Replace example domains with your own endpoint.
- Review `wrangler.toml` values and secret names.
- Confirm auth behavior matches your public deployment plan.
