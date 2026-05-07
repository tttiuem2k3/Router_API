# Agent Skills

This directory contains raw skill documents that can be hosted from your own GitHub repository and consumed by compatible AI agents.

## Recommended raw URLs

Replace `<your-account>` and `<your-repo>` with your GitHub repository values.

| Capability | Raw URL template |
|---|---|
| Entry / Setup | `https://raw.githubusercontent.com/<your-account>/<your-repo>/main/skills/<entry-skill-folder>/SKILL.md` |
| Chat / code-gen | `https://raw.githubusercontent.com/<your-account>/<your-repo>/main/skills/<chat-skill-folder>/SKILL.md` |
| Image generation | `https://raw.githubusercontent.com/<your-account>/<your-repo>/main/skills/<image-skill-folder>/SKILL.md` |
| Text-to-speech | `https://raw.githubusercontent.com/<your-account>/<your-repo>/main/skills/<tts-skill-folder>/SKILL.md` |
| Speech-to-text | `https://raw.githubusercontent.com/<your-account>/<your-repo>/main/skills/<stt-skill-folder>/SKILL.md` |
| Embeddings | `https://raw.githubusercontent.com/<your-account>/<your-repo>/main/skills/<embeddings-skill-folder>/SKILL.md` |
| Web search | `https://raw.githubusercontent.com/<your-account>/<your-repo>/main/skills/<web-search-skill-folder>/SKILL.md` |
| Web fetch | `https://raw.githubusercontent.com/<your-account>/<your-repo>/main/skills/<web-fetch-skill-folder>/SKILL.md` |

## Example prompt

```text
Read this skill and use it: https://raw.githubusercontent.com/<your-account>/<your-repo>/main/skills/<entry-skill-folder>/SKILL.md
```

## Local configuration

```bash
export TTTRouterAPI_URL="http://localhost:20128"
export TTTRouterAPI_KEY="sk-..."
```

Health check:

```bash
curl http://localhost:20128/api/health
```

## Publishing notes

- Keep raw URLs in sync with your default branch name.
- Review the skill folder names before publishing if you rename the project.
- Update any remaining upstream references inside individual `SKILL.md` files if you want a fully rebranded fork.
