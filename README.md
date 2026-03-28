# @sudobility/testomniac-bot

GitHub App bot that reviews pull requests using Claude AI, acting as a team member.

## Setup

### 1. Create a GitHub App

1. Go to **GitHub Settings > Developer settings > GitHub Apps > New GitHub App**
2. Set the webhook URL to `https://your-domain.com/webhook`
3. Permissions:
   - **Pull requests**: Read & Write
   - **Contents**: Read
4. Subscribe to events: **Pull request**
5. Generate a private key and download the `.pem` file

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in:
- `GITHUB_APP_ID` — from the app settings page
- `GITHUB_PRIVATE_KEY` — base64-encode your `.pem`: `base64 -i your-app.pem`
- `GITHUB_WEBHOOK_SECRET` — the secret you set when creating the app
- `ANTHROPIC_API_KEY` — your Anthropic API key

### 3. Install dependencies

```bash
bun install
```

### 4. Run

```bash
bun dev
```

For local development, use [smee.io](https://smee.io) or ngrok to tunnel webhooks to localhost.

## How it works

When a PR is opened or updated, the bot:
1. Fetches the diff via GitHub API
2. Sends it to Claude for review
3. Posts the review as a PR comment

## License

BUSL-1.1
