---
name: TTT Router API
description: Entry point for TTT Router API â€” local/remote AI gateway with OpenAI-compatible REST for chat, image, TTS, embeddings, web search, web fetch. Use when the user mentions TTT Router API, TTTRouterAPI_URL, or wants AI without writing provider boilerplate. This skill covers setup + indexes capability skills; fetch the relevant capability SKILL.md from the URLs below when needed.
---

# TTT Router API

Local/remote AI gateway exposing OpenAI-compatible REST. One key, many providers, auto-fallback.

## Setup

```bash
export TTTRouterAPI_URL="http://localhost:20128"      # or VPS / tunnel URL
export TTTRouterAPI_KEY="sk-..."                      # from Dashboard â†’ Keys (only if requireApiKey=true)
```

All requests: `${TTTRouterAPI_URL}/v1/...` with header `Authorization: Bearer ${TTTRouterAPI_KEY}` (omit if auth disabled).

Verify: `curl $TTTRouterAPI_URL/api/health` â†’ `{"ok":true}`

## Discover models

```bash
curl $TTTRouterAPI_URL/v1/models                  # chat/LLM (default)
curl $TTTRouterAPI_URL/v1/models/image            # image-gen
curl $TTTRouterAPI_URL/v1/models/tts              # text-to-speech
curl $TTTRouterAPI_URL/v1/models/embedding        # embeddings
curl $TTTRouterAPI_URL/v1/models/web              # web search + fetch (entries have `kind` field)
curl $TTTRouterAPI_URL/v1/models/stt              # speech-to-text
curl $TTTRouterAPI_URL/v1/models/image-to-text    # vision
```

Use `data[].id` as `model` field in requests. Combos appear with `owned_by:"combo"`.

Response shape:
```json
{ "object": "list", "data": [
  { "id": "openai/gpt-5", "object": "model", "owned_by": "openai", "created": 1735000000 },
  { "id": "tavily/search", "object": "model", "kind": "webSearch", "owned_by": "tavily", "created": 1735000000 }
]}
```

## Capability skills

When the user needs a specific capability, fetch that skill's `SKILL.md` from its raw URL:

| Capability | Raw URL |
|---|---|
| Chat / code-gen | https://raw.githubusercontent.com/decolua/ttt-router-api/refs/heads/master/skills/TTT Router API-chat/SKILL.md |
| Image generation | https://raw.githubusercontent.com/decolua/ttt-router-api/refs/heads/master/skills/TTT Router API-image/SKILL.md |
| Text-to-speech | https://raw.githubusercontent.com/decolua/ttt-router-api/refs/heads/master/skills/TTT Router API-tts/SKILL.md |
| Speech-to-text | https://raw.githubusercontent.com/decolua/ttt-router-api/refs/heads/master/skills/TTT Router API-stt/SKILL.md |
| Embeddings | https://raw.githubusercontent.com/decolua/ttt-router-api/refs/heads/master/skills/TTT Router API-embeddings/SKILL.md |
| Web search | https://raw.githubusercontent.com/decolua/ttt-router-api/refs/heads/master/skills/TTT Router API-web-search/SKILL.md |
| Web fetch (URL â†’ markdown) | https://raw.githubusercontent.com/decolua/ttt-router-api/refs/heads/master/skills/TTT Router API-web-fetch/SKILL.md |

## Errors

- 401 â†’ set/refresh `TTTRouterAPI_KEY` (Dashboard â†’ Keys)
- 400 `Invalid model format` â†’ check `model` exists in `/v1/models/<kind>`
- 503 `All accounts unavailable` â†’ wait `retry-after` or add another provider account
