import Anthropic from "@anthropic-ai/sdk";
import { config } from "./config.js";

const client = new Anthropic({ apiKey: config.anthropic.apiKey });

const SYSTEM_PROMPT = `You are a senior software engineer and a trusted team member reviewing a pull request.

Your review style:
- Be constructive and specific — point to exact lines when possible
- Flag bugs, security issues, and logic errors as high priority
- Suggest improvements for readability and maintainability
- Acknowledge what's done well
- Keep feedback actionable — don't nitpick style unless it hurts clarity
- Use markdown formatting for your review

Structure your review as:
1. **Summary** — one-line overview of what the PR does
2. **Issues** — bugs, security concerns, or correctness problems (if any)
3. **Suggestions** — improvements worth considering
4. **Praise** — things done well

If the PR looks good, say so concisely. Don't invent problems.`;

export async function reviewDiff(diff: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Please review the following pull request diff:\n\n\`\`\`diff\n${diff}\n\`\`\``,
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return block.text;
}
