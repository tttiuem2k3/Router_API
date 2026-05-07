---
name: TTT Router API-tts
description: Text-to-speech via TTT Router API /v1/audio/speech using OpenAI / ElevenLabs / Deepgram / Edge TTS / Google TTS / Hyperbolic / Inworld voices. Use when the user wants to convert text to speech, generate audio, voiceover, narrate, or read text aloud.
---

# TTT Router API â€” Text-to-Speech

Requires `TTTRouterAPI_URL` (and `TTTRouterAPI_KEY` if auth enabled). See https://raw.githubusercontent.com/decolua/ttt-router-api/refs/heads/master/skills/TTT Router API/SKILL.md for setup.

## Discover voices

```bash
curl $TTTRouterAPI_URL/v1/models/tts | jq '.data[].id'
```

`model` = voice ID (e.g. `openai/tts-1`, `el/eleven_multilingual_v2`, `edge-tts/en-US-AriaNeural`).

## Endpoint

`POST $TTTRouterAPI_URL/v1/audio/speech`

| Field | Required | Notes |
|---|---|---|
| `model` | yes | voice ID from `/v1/models/tts` |
| `input` | yes | text to speak |

Query `?response_format=mp3` (default, raw bytes) or `?response_format=json` (`{audio: base64, format}`).

## Examples

Save MP3:

```bash
curl -X POST "$TTTRouterAPI_URL/v1/audio/speech" \
  -H "Authorization: Bearer $TTTRouterAPI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"openai/tts-1","input":"Hello world"}' \
  --output speech.mp3
```

JS (save file):

```js
import { writeFile } from "node:fs/promises";
const r = await fetch(`${process.env.TTTRouterAPI_URL}/v1/audio/speech`, {
  method: "POST",
  headers: { "Authorization": `Bearer ${process.env.TTTRouterAPI_KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({ model: "el/eleven_multilingual_v2", input: "Xin chÃ o" }),
});
await writeFile("speech.mp3", Buffer.from(await r.arrayBuffer()));
```

## Response shape

Default â†’ raw audio bytes (Content-Type `audio/mp3`).

`?response_format=json`:
```json
{ "audio": "SUQzBAAAA...", "format": "mp3" }
```

## Provider quirks (model format)

| Provider | `model` format | Notes |
|---|---|---|
| `openai` | `tts-1/alloy` (model/voice) or just voice | Default model `gpt-4o-mini-tts` |
| `elevenlabs` | `<model_id>/<voice_id>` or `<voice_id>` | Default model `eleven_flash_v2_5`; list voices in Dashboard |
| `openrouter` | `openai/gpt-4o-mini-tts/alloy` | Streamed via chat-completions audio modality |
| `edge-tts` | voice id e.g. `vi-VN-HoaiMyNeural` | **noAuth**; default `vi-VN-HoaiMyNeural` |
| `google-tts` | language code e.g. `en`, `vi` | **noAuth** |
| `local-device` | OS voice name (`say -v ?` / SAPI) | **noAuth**; needs `ffmpeg` |
| `deepgram` | `aura-asteria-en` etc | Token auth |
| `nvidia`, `inworld`, `cartesia`, `playht` | `model/voice` | Provider-specific auth header |
| `coqui`, `tortoise` | speaker / voice id | Localhost noAuth |
| `hyperbolic` | model id | Body = `{text}` only |
