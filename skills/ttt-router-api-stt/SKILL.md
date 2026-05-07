---
name: TTT Router API-stt
description: Speech-to-text via TTT Router API /v1/audio/transcriptions using OpenAI Whisper / Groq / Gemini / Deepgram / AssemblyAI / NVIDIA / HuggingFace models. Use when the user wants to transcribe audio, convert speech to text, or get subtitles from audio files.
---

# TTT Router API â€” Speech-to-Text

Requires `TTTRouterAPI_URL` (and `TTTRouterAPI_KEY` if auth enabled). See https://raw.githubusercontent.com/decolua/ttt-router-api/refs/heads/master/skills/TTT Router API/SKILL.md for setup.

## Discover models

```bash
curl $TTTRouterAPI_URL/v1/models/stt | jq '.data[].id'
```

`model` = STT model ID (e.g. `openai/whisper-1`, `groq/whisper-large-v3`, `deepgram/nova-3`, `gemini/gemini-2.5-flash`).

## Endpoint

`POST $TTTRouterAPI_URL/v1/audio/transcriptions` (OpenAI Whisper compatible, `multipart/form-data`)

| Field | Required | Notes |
|---|---|---|
| `model` | yes | from `/v1/models/stt` |
| `file` | yes | audio file (mp3, wav, m4a, webm, ogg, flac) |
| `language` | no | ISO-639-1 (e.g. `en`, `vi`) |
| `prompt` | no | hint text to guide transcription |
| `response_format` | no | `json` (default) / `text` / `verbose_json` / `srt` / `vtt` |
| `temperature` | no | 0â€“1 |

## Examples

```bash
curl -X POST "$TTTRouterAPI_URL/v1/audio/transcriptions" \
  -H "Authorization: Bearer $TTTRouterAPI_KEY" \
  -F "model=openai/whisper-1" \
  -F "file=@audio.mp3" \
  -F "language=vi"
```

JS (Node):

```js
import { createReadStream } from "node:fs";
const form = new FormData();
form.append("model", "groq/whisper-large-v3-turbo");
form.append("file", new Blob([await (await import("node:fs/promises")).readFile("audio.mp3")]), "audio.mp3");
const r = await fetch(`${process.env.TTTRouterAPI_URL}/v1/audio/transcriptions`, {
  method: "POST",
  headers: { "Authorization": `Bearer ${process.env.TTTRouterAPI_KEY}` },
  body: form,
});
const { text } = await r.json();
console.log(text);
```

## Response shape

Default (`response_format=json`):
```json
{ "text": "Xin chÃ o, Ä‘Ã¢y lÃ  báº£n ghi Ã¢m." }
```

`verbose_json` adds `language`, `duration`, `segments[]` with timestamps.
`srt` / `vtt` return subtitle text.

## Provider quirks

| Provider | `model` format | Notes |
|---|---|---|
| `openai` | `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe` | Native OpenAI shape |
| `groq` | `whisper-large-v3`, `whisper-large-v3-turbo`, `distil-whisper-large-v3-en` | Fastest; OpenAI shape |
| `gemini` | `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-2.5-flash-lite` | Server converts to `generateContent` with audio inline |
| `deepgram` | `nova-3`, `nova-2`, `whisper-large` | Token auth; server adapts response |
| `assemblyai` | `universal-3-pro`, `universal-2` | Async upload+poll handled server-side |
| `nvidia` | `nvidia/parakeet-ctc-1.1b-asr` | NIM endpoint |
| `huggingface` | `openai/whisper-large-v3`, `openai/whisper-small` | HF Inference API |
