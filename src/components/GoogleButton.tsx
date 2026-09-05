import { LoaderCircle } from "lucide-react";
import { cn } from "../utils/cn";

/** Official multicolor Google "G" mark. */
export function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-[19px] w-[19px]", className)} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.56-5.16 3.56-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.96H1.21v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.57.38-2.29V6.62H1.21a12 12 0 0 0 0 10.76l4.08-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.42-3.42A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.21 6.62l4.08 3.09C6.23 6.88 8.88 4.77 12 4.77Z"
      />
    </svg>
  );
}

interface GoogleButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
}

/**
 * "Continue with Google" — white bordered button with the official G mark.
 * Currently a frontend demo trigger; structured so it can later be swapped
 * for a real Google OAuth / Firebase flow without changing the UI.
 */
export default function GoogleButton({ onClick, loading = false, disabled = false, label = "Continue with Google" }: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "inline-flex h-[52px] w-full items-center justify-center gap-3 rounded-xl border-[1.5px] border-[#DFE4DF] bg-white text-[14.5px] font-semibold text-[#111111] shadow-[0_8px_22px_-12px_rgba(17,17,17,0.14)] transition-all duration-200",
        "hover:border-[#c9cec9] hover:bg-[#FAFBFA] hover:shadow-[0_12px_28px_-12px_rgba(17,17,17,0.18)]",
        "disabled:cursor-not-allowed disabled:opacity-70"
      )}
    >
      {loading ? (
        <LoaderCircle className="h-[19px] w-[19px] animate-spin text-[#666666]" strokeWidth={2.4} />
      ) : (
        <GoogleLogo />
      )}
      {loading ? "Connecting to Google..." : label}
    </button>
  );
}
