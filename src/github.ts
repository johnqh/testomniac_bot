import { App } from "@octokit/app";
import { config } from "./config.js";

export const githubApp = new App({
  appId: config.github.appId,
  privateKey: config.github.privateKey,
  webhooks: { secret: config.github.webhookSecret },
});

export async function getInstallationOctokit(installationId: number) {
  return githubApp.getInstallationOctokit(installationId);
}

export async function getPullRequestDiff(
  octokit: Awaited<ReturnType<typeof getInstallationOctokit>>,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<string> {
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}",
    {
      owner,
      repo,
      pull_number: pullNumber,
      mediaType: { format: "diff" },
    }
  );
  return data as unknown as string;
}

export async function submitReview(
  octokit: Awaited<ReturnType<typeof getInstallationOctokit>>,
  owner: string,
  repo: string,
  pullNumber: number,
  body: string
) {
  await octokit.request(
    "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
    {
      owner,
      repo,
      pull_number: pullNumber,
      event: "COMMENT",
      body,
    }
  );
}
