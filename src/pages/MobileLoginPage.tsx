import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  LoaderCircle,
  Smartphone,
} from "lucide-react";
import LoginBrandPanel from "../components/LoginBrandPanel";
import { supabase } from "../lib/supabase";

/** /login/mobile — Supabase Phone OTP Login */
export default function MobileLoginPage() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formattedPhone = `+91${mobile.trim()}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      if (error) throw error;
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please check your number.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formattedPhone = `+91${mobile.trim()}`;
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp.trim(),
        type: "sms",
      });
      if (error) throw error;
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white lg:flex">
      <LoginBrandPanel />

      <section
        aria-label="Login with mobile number"
        className="flex flex-1 items-center justify-center bg-white px-5 py-14 sm:px-8 lg:min-h-screen lg:py-10"
      >
        <div className="w-full max-w-[480px]">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#666666] transition-colors hover:text-[#2E7D32]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to login options
          </Link>

          <div className="mt-6 rounded-[26px] border border-[#E1E5E1] bg-white p-7 shadow-[0_16px_44px_-18px_rgba(17,17,17,0.16)] sm:p-9">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#EAF6EA]">
              <Smartphone className="h-[26px] w-[26px] text-[#2E7D32]" strokeWidth={2} />
            </span>
            <h1 className="mt-5 font-display text-[24px] font-bold text-[#111111]">
              Login with Mobile Number
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[#666666]">
              {step === "phone"
                ? "Enter your registered mobile number — we'll send you an OTP to verify."
                : `Enter the 6-digit OTP code sent to +91 ${mobile}`}
            </p>

            {step === "phone" ? (
              <form onSubmit={handleSendOtp} className="mt-7">
                <label
                  htmlFor="mobile-number"
                  className="mb-1.5 block text-[13px] font-semibold text-[#111111]"
                >
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex h-[54px] items-center rounded-l-xl border border-r-0 border-[#E1E5E1] bg-[#F5F7F5] px-4 text-[14.5px] font-semibold text-[#444444]">
                    +91
                  </span>
                  <input
                    id="mobile-number"
                    name="mobile"
                    type="tel"
                    inputMode="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="98XXXXXX21"
                    className="h-[54px] w-full rounded-r-xl border border-[#E1E5E1] bg-[#FAFBFA] px-4 text-[15px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white"
                  />
                </div>

                {error && (
                  <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-red-600">
                    <CircleAlert className="h-4 w-4 shrink-0" />
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="mt-5 inline-flex h-[54px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#2E7D32] text-[15px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:bg-[#256628] disabled:cursor-wait disabled:opacity-85"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="h-[18px] w-[18px] animate-spin" strokeWidth={2.4} />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="h-[17px] w-[17px]" strokeWidth={2.4} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="mt-7">
                <label
                  htmlFor="otp-code"
                  className="mb-1.5 block text-[13px] font-semibold text-[#111111]"
                >
                  Enter 6-Digit OTP
                </label>
                <input
                  id="otp-code"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="h-[54px] w-full rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] px-4 text-center text-[20px] font-bold tracking-widest text-[#111111] transition-colors outline-none focus:border-[#2E7D32] focus:bg-white"
                />

                {error && (
                  <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-red-600">
                    <CircleAlert className="h-4 w-4 shrink-0" />
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="mt-5 inline-flex h-[54px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#2E7D32] text-[15px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:bg-[#256628] disabled:cursor-wait disabled:opacity-85"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="h-[18px] w-[18px] animate-spin" strokeWidth={2.4} />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify &amp; Login
                      <ArrowRight className="h-[17px] w-[17px]" strokeWidth={2.4} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setError("");
                  }}
                  className="mt-4 w-full text-center text-[13px] font-medium text-[#666666] hover:text-[#2E7D32]"
                >
                  Change mobile number
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
