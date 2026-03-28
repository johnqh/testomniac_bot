import type { EmitterWebhookEvent } from "@octokit/webhooks";
import { githubApp, getInstallationOctokit, getPullRequestDiff, submitReview } from "./github.js";
import { reviewDiff } from "./reviewer.js";

export function registerWebhooks() {
  githubApp.webhooks.on(
    ["pull_request.opened", "pull_request.synchronize"],
    async ({ payload }: EmitterWebhookEvent<"pull_request">) => {
      const { pull_request: pr, repository, installation } = payload;

      if (!installation) {
        console.error("No installation found in webhook payload");
        return;
      }

      console.log(
        `Reviewing PR #${pr.number} "${pr.title}" in ${repository.full_name}`
      );

      try {
        const octokit = await getInstallationOctokit(installation.id);

        const diff = await getPullRequestDiff(
          octokit,
          repository.owner.login,
          repository.name,
          pr.number
        );

        if (!diff || diff.length === 0) {
          console.log(`PR #${pr.number} has no diff, skipping`);
          return;
        }

        // Truncate very large diffs to stay within token limits
        const maxDiffLength = 100_000;
        const truncatedDiff =
          diff.length > maxDiffLength
            ? diff.slice(0, maxDiffLength) +
              "\n\n... (diff truncated due to size)"
            : diff;

        const review = await reviewDiff(truncatedDiff);

        await submitReview(
          octokit,
          repository.owner.login,
          repository.name,
          pr.number,
          review
        );

        console.log(`Review posted for PR #${pr.number}`);
      } catch (error) {
        console.error(`Failed to review PR #${pr.number}:`, error);
      }
    }
  );
}
