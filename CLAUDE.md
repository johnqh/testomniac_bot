# testomniac_bot

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
