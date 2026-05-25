export type FygaroEnvConfig = {
  apiKey: string;
  merchantId: string;
  webhookSecret: string | null;
  sandbox: boolean;
  apiBaseUrl: string;
};

function pickFirst(...values: Array<string | undefined>): string | undefined {
  return values.find((v) => typeof v === 'string' && v.trim().length > 0)?.trim();
}

function isTruthy(value: string | undefined): boolean {
  if (!value) return false;
  const n = value.trim().toLowerCase();
  return n === '1' || n === 'true' || n === 'yes' || n === 'on';
}

export function getFygaroEnvConfig(): FygaroEnvConfig | null {
  const apiKey = pickFirst(process.env.FYGARO_API_SECRET, process.env.FIGARO_API_KEY);
  const merchantId = pickFirst(
    process.env.FYGARO_MERCHANT_ID,
    process.env.FIGARO_MERCHANT_ID,
    process.env.NEXT_PUBLIC_FYGARO_MERCHANT_ID,
  );
  const webhookSecret = pickFirst(process.env.FYGARO_WEBHOOK_SECRET, process.env.FIGARO_WEBHOOK_SECRET) ?? null;
  const sandbox = isTruthy(pickFirst(process.env.FYGARO_SANDBOX, process.env.FIGARO_SANDBOX));

  if (!apiKey || !merchantId) return null;

  return {
    apiKey,
    merchantId,
    webhookSecret,
    sandbox,
    apiBaseUrl: sandbox ? 'https://sandbox.figaro.ky/api/v1' : 'https://api.figaro.ky/v1',
  };
}

export const FYGARO_REQUIRED_ENV_HINT =
  'Missing payment config. Set FYGARO_API_SECRET (or FIGARO_API_KEY) and FYGARO_MERCHANT_ID (or FIGARO_MERCHANT_ID).';

/**
 * Fygaro Payment Links — simpler approach that works without API keys.
 * Set FYGARO_PAYMENT_LINK in Vercel env to override. Falls back to SOV Digital default link.
 */
export function getFygaroPaymentLinkUrl(): string {
  return (
    process.env.FYGARO_PAYMENT_LINK?.trim() ||
    'https://www.fygaro.com/en/pb/e8b3a9a5-cb14-4715-aae6-0c423783e2c4'
  );
}
