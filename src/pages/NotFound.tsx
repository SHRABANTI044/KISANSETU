import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 bg-ks-bg px-6 pt-[90px] text-center">
      <p className="font-display text-[64px] leading-none font-bold text-ks-green/25">404</p>
      <h1 className="font-display text-[24px] font-bold text-ks-dark">This field isn&apos;t planted yet</h1>
      <p className="max-w-sm text-[14.5px] text-ks-muted">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex h-[48px] items-center gap-2.5 rounded-full bg-ks-green px-7 text-[14.5px] font-semibold text-white transition-all duration-300 hover:bg-ks-dark"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
        Back to Home
      </Link>
    </div>
  );
}
