function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const config = {
  port: Number(process.env.PORT || 8022),
  github: {
    appId: required("GITHUB_APP_ID"),
    privateKey: Buffer.from(
      required("GITHUB_PRIVATE_KEY"),
      "base64"
    ).toString("utf-8"),
    webhookSecret: required("GITHUB_WEBHOOK_SECRET"),
  },
  anthropic: {
    apiKey: required("ANTHROPIC_API_KEY"),
  },
};
