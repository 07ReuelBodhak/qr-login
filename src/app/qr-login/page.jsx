"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function QRApprovePage() {
  const params = useSearchParams();
  const token = params.get("token");

  const { data: session } = useSession();

  async function approveLogin() {
    await fetch("/api/qr/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    alert("Approved ✅");
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login on mobile first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Approve Desktop Login?</h1>

      <button
        onClick={approveLogin}
        className="bg-green-600 text-white px-6 py-3 rounded-xl"
      >
        Approve Login
      </button>
    </div>
  );
}
