"use client";

import { useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function QRClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { data: session, status } = useSession();

  async function approveLogin() {
    await fetch("/api/qr/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ send session cookie
      body: JSON.stringify({ token }),
    });

    alert("✅ Approved! Desktop will login now.");
  }

  // 2. If user is NOT logged in → show Discord login button
  if (!session) {
    return (
      <div className="bg-zinc-900 p-8 rounded-xl text-center space-y-4">
        <h1 className="text-white text-2xl font-bold">Login Required</h1>

        <p className="text-gray-400 text-sm">
          You must login with Discord on mobile before approving this QR login.
        </p>

        <button
          onClick={() => signIn("discord")}
          className="bg-indigo-600 px-5 py-2 rounded-lg text-white"
        >
          Login with Discord
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 p-8 rounded-xl text-center space-y-4">
      <h1 className="text-white text-2xl font-bold">Mobile Approval</h1>

      <p className="text-gray-400 text-sm">Token: {token}</p>

      <button
        onClick={approveLogin}
        className="bg-green-600 px-5 py-2 rounded-lg text-white"
      >
        Approve Login
      </button>
    </div>
  );
}
