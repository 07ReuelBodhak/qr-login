import crypto from "crypto";
import { url } from "inspector";

export const qrStore = new Map();

export async function GET() {
  const token = crypto.randomUUID();

  qrStore.set(token, {
    approved: false,
    userId: null,
  });

  return Response.json({
    token,
    url: `${process.env.NEXTAUTH_URL}/qr-login?token=${token}`,
  });
}
