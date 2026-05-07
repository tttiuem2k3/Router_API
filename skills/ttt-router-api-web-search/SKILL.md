---
name: TTT Router API-web-search
description: Web search via TTT Router API /v1/search using Tavily / Exa / Brave / Serper / SearXNG / Google PSE / Linkup / SearchAPI / You.com / Perplexity. Use when the user wants to search the web, look up information, find articles, or query a search engine.
---

# TTT Router API â€” Web Search

Requires `TTTRouterAPI_URL` (and `TTTRouterAPI_KEY` if auth enabled). See https://raw.githubusercontent.com/decolua/ttt-router-api/refs/heads/master/skills/TTT Router API/SKILL.md for setup.

## Discover providers

```bash
curl $TTTRouterAPI_URL/v1/models/web | jq '.data[] | select(.kind=="webSearch") | .id'
```

IDs end in `/search` (e.g. `tavily/search`). Combos (`owned_by:"combo"`) chain providers with auto-fallback.

## Endpoint

`POST $TTTRouterAPI_URL/v1/search`

| Field | Required | Notes |
|---|---|---|
| `model` (or `provider`) | yes | from `/v1/models/web` (e.g. `tavily/search` or just `tavily`) |
| `query` | yes | search query |
| `max_results` | no | default 5 |
| `search_type` | no | `web` (default) / `news` |
| `country`, `language`, `time_range`, `domain_filter` | no | provider-dependent |

## Examples

```bash
curl -X POST $TTTRouterAPI_URL/v1/search \
  -H "Authorization: Bearer $TTTRouterAPI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"tavily/search","query":"TTT Router API open source","max_results":5}'
```

JS:

```js
const r = await fetch(`${process.env.TTTRouterAPI_URL}/v1/search`, {
  method: "POST",
  headers: { "Authorization": `Bearer ${process.env.TTTRouterAPI_KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({ model: "search-combo", query: "latest LLM benchmarks", max_results: 10 }),
});
console.log(await r.json());
```

## Response shape

```json
{
  "provider": "tavily",
  "query": "TTT Router API open source",
  "results": [
    {
      "title": "...", "url": "https://...", "display_url": "github.com/...",
      "snippet": "...", "position": 1, "score": 0.92,
      "published_at": null, "favicon_url": null, "content": null,
      "metadata": { "author": null, "language": null, "source_type": null, "image_url": null },
      "citation": { "provider": "tavily", "retrieved_at": "2026-...", "rank": 1 }
    }
  ],
  "answer": null,
  "usage": { "queries_used": 1, "search_cost_usd": 0.008 },
  "metrics": { "response_time_ms": 850, "upstream_latency_ms": 700, "total_results_available": 12 },
  "errors": []
}
```

## Provider quirks

All accept `query` + `max_results`. Optional fields vary:

| Provider | Supports | Required extras |
|---|---|---|
| `tavily` | country, domain_filter, news topic | â€” |
| `exa` | domain_filter (incl/excl), news category | â€” |
| `brave-search` | country, language | â€” |
| `serper` | country, language, news endpoint | â€” |
| `perplexity` | country, language, domain_filter | â€” |
| `linkup` | domain_filter, time_range | `depth: fast/standard/deep` (option) |
| `google-pse` | country, language, time_range, offset | **`cx` required** (providerOptions) |
| `searchapi` | country, language, pagination | â€” |
| `youcom` | country, language, time_range, domain_filter, full_page | â€” |
| `searxng` | language, time_range | Self-hosted, **noAuth** |

Provider IS the model â€” `"provider":"tavily"` â‰¡ `"model":"tavily/search"`.
