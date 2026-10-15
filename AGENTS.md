# Project instructions for Codex

Codex reads this file automatically. Claude Code reads `CLAUDE.md`. Both tools must follow the same brief, so:

1. Before any task, read `CLAUDE.md` in this folder. It holds the client, the goal, the source material, the references and the project rules.
2. Also read `DECISIONS.md`, `PROGRESS.md` and `HANDOVER.md` if they exist.
3. If anything in this file and `CLAUDE.md` ever disagree, `CLAUDE.md` wins. Tell the person so they can fix it.

When you start a session, say in one line which of these files you read, so the person can confirm the rules loaded.
<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
