# testomniac_bot

> **Git policy — never auto-commit or auto-push.** Leave your work in the working tree.
> Run `git commit`, `git push`, `gh pr create`, or `scripts/push_all.sh` **only when the user
> explicitly asks in that turn**. Approval for an earlier change does not carry forward, and
> finishing a task is not permission to commit it.

GitHub App bot that reviews pull requests using Claude.

## Tech Stack

- **Runtime**: Bun
- **Server**: Hono
- **GitHub**: @octokit/app + @octokit/webhooks
- **AI**: @anthropic-ai/sdk (claude-sonnet-4-6)

## Project Structure

```
src/
├── index.ts       # Hono server entry, webhook route
├── config.ts      # Environment variable loading
├── github.ts      # GitHub App auth, diff fetching, review posting
├── reviewer.ts    # Claude API integration, review prompt
└── webhook.ts     # Webhook event handlers
```

## Commands

- `bun dev` — start with hot reload
- `bun start` — production start
- `bun run typecheck` — type check

## Patterns

- GitHub App auth via JWT + installation tokens (handled by @octokit/app)
- Webhook signature verification on every request
- Diff truncated to 100k chars to stay within token limits
- Reviews posted as PR review comments (COMMENT event, not APPROVE/REQUEST_CHANGES)

## Environment

Requires `.env` — see `.env.example` for required vars. `GITHUB_PRIVATE_KEY` is base64-encoded.

## Related Projects

Part of the testomniac family.

## Git Workflow

- Do not use feature branches for code changes. Always stay on the current branch.
