import { Suspense } from "react";
import QRClient from "./QrClient";

import { useSession, signIn } from "next-auth/react";

export default function QRLoginPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <button onClick={() => signIn("discord")}>Login first to approve</button>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Suspense fallback={<p className="text-white">Loading...</p>}>
        <QRClient />
      </Suspense>
    </div>
  );
}
