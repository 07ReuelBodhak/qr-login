import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { qrStore } from "../create/route";

export async function POST(req) {
  const { token } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const qr = qrStore.get(token);

  if (!qr) {
    return Response.json({ error: "Invalid token" }, { status: 400 });
  }

  qr.approved = true;
  qr.userId = session.user.email;

  qrStore.set(token, qr);

  return Response.json({ success: true });
}
