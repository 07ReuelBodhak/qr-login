import { qrStore } from "../create/route";

export async function GET(req) {
  const token = req.nextUrl.searchParams.get("token");

  const session = qrStore.get(token);

  if (!session) {
    return Response.json({ error: "Invalid token" });
  }

  return Response.json(session);
}
