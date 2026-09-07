import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CircleCheck, Lock, LoaderCircle } from "lucide-react";
import LoginBrandPanel from "../components/LoginBrandPanel";

/** /forgot-password — frontend-only placeholder (no real recovery yet). */
export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setSent(false);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-white lg:flex">
      <LoginBrandPanel />

      <section
        aria-label="Forgot password"
        className="flex flex-1 items-center justify-center bg-white px-5 py-14 sm:px-8 lg:min-h-screen lg:py-10"
      >
        <div className="w-full max-w-[480px]">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#666666] transition-colors hover:text-[#2E7D32]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>

          <div className="mt-6 rounded-[26px] border border-[#E1E5E1] bg-white p-7 shadow-[0_16px_44px_-18px_rgba(17,17,17,0.16)] sm:p-9">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#EAF6EA]">
              <Lock className="h-[24px] w-[24px] text-[#2E7D32]" strokeWidth={2} />
            </span>
            <h1 className="mt-5 font-display text-[24px] font-bold text-[#111111]">
              Forgot Password
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[#666666]">
              Enter your registered email or mobile number and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="mt-7">
              <label htmlFor="reset-identity" className="mb-1.5 block text-[13px] font-semibold text-[#111111]">
                Email or Mobile Number
              </label>
              <input
                id="reset-identity"
                name="identity"
                type="text"
                required
                placeholder="you@example.com / 98XXXXXX21"
                className="h-[54px] w-full rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-4 text-[15px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white"
              />

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="mt-5 inline-flex h-[54px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#2E7D32] text-[15px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:bg-[#256628] disabled:cursor-wait disabled:opacity-85"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-[18px] w-[18px] animate-spin" strokeWidth={2.4} />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="h-[17px] w-[17px]" strokeWidth={2.4} />
                  </>
                )}
              </button>

              {sent && (
                <p
                  role="status"
                  className="animate-pop-in mt-4 flex items-center gap-2.5 rounded-xl border border-[#2E7D32]/25 bg-[#EAF6EA] px-4 py-3 text-[13px] font-medium text-[#155B32]"
                >
                  <CircleCheck className="h-[18px] w-[18px] shrink-0 text-[#2E7D32]" strokeWidth={2.2} />
                  If an account exists, a reset link will be sent. (Frontend demo only.)
                </p>
              )}

              <p className="mt-4 text-center text-[11.5px] text-[#888888]">
                Password recovery will be enabled once the backend is connected.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
