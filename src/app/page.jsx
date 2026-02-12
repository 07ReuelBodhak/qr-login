"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import qrcodegen from "nayuki-qr-code-generator";

export default function LoginPage() {
  const { data: session, status } = useSession();

  const [qrCode, setQrCode] = useState("");
  const [token, setToken] = useState("");

  const toSvgString = (qr, border, size) => {
    let svg = `<svg width="${size}" height="${size}"
      viewBox="0 0 ${qr.size + border * 2} ${qr.size + border * 2}"
      xmlns="http://www.w3.org/2000/svg">`;

    for (let y = 0; y < qr.size; y++) {
      for (let x = 0; x < qr.size; x++) {
        if (qr.getModule(x, y)) {
          svg += `<rect x="${x + border}" y="${y + border}"
            width="1" height="1" fill="black"/>`;
        }
      }
    }

    svg += "</svg>";
    return svg;
  };

  useEffect(() => {
    console.log(session);
    if (session) return;

    async function createQR() {
      const res = await fetch("/api/qr/create");
      const data = await res.json();

      setToken(data.token);

      const QRC = qrcodegen.QrCode;
      const qr = QRC.encodeText(data.url, QRC.Ecc.MEDIUM);

      const svg = toSvgString(qr, 2, 200);
      setQrCode(`data:image/svg+xml;base64,${btoa(svg)}`);
    }

    createQR();
  }, [session]);

  useEffect(() => {
    if (!token || session) return;
    console.log(token);
    const interval = setInterval(async () => {
      const res = await fetch(`/api/qr/status?token=${token}`);
      const data = await res.json();
      console.log(data);
      if (data.approved) {
        window.location.href = "/dashboard";
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [token, session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-white text-center">
          {session ? "Welcome Back" : "Login"}
        </h1>

        {/* ✅ If Session Exists → Show Logout */}
        {session ? (
          <div className="text-center space-y-4">
            <p className="text-gray-300">
              Logged in as:{" "}
              <span className="font-semibold text-white">
                {session.user?.email}
              </span>
            </p>

            <button
              onClick={() => signOut()}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            {/* ❌ No Session → Show Login Button */}
            <button
              onClick={() => signIn("discord")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
            >
              Login with Discord
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-zinc-700" />
              <p className="text-gray-400 text-sm">OR</p>
              <div className="flex-1 h-[1px] bg-zinc-700" />
            </div>

            {/* QR Login */}
            <div className="text-center space-y-3">
              <h2 className="text-white font-semibold">Scan QR to Login</h2>

              {qrCode && (
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="mx-auto bg-white p-2 rounded-xl"
                />
              )}

              <p className="text-gray-400 text-sm">
                Scan with your logged-in mobile device
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
