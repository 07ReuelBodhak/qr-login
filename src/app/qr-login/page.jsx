import { Suspense } from "react";
import QRClient from "./QrClient";

export default function QRLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Suspense fallback={<p className="text-white">Loading...</p>}>
        <QRClient />
      </Suspense>
    </div>
  );
}
