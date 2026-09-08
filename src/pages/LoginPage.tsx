import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import BuyerLoginForm from "../components/BuyerLoginForm";
import FarmerLoginForm from "../components/FarmerLoginForm";
import LoginBrandPanel from "../components/LoginBrandPanel";
import LoginRoleCard from "../components/LoginRoleCard";
import { cn } from "../utils/cn";

type LoginView = "select" | "farmer" | "buyer";

/**
 * /login — full-screen two-column login (≈40% brand panel / ≈60% login area),
 * matching the provided reference. Rendered without the site navbar/footer.
 *
 * Flow: role selection (reference view) → inline role login form
 *       → "Logging in..." → role dashboard.
 */
export default function LoginPage() {
  const [view, setView] = useState<LoginView>("select");

  return (
    <main className="min-h-screen bg-white lg:flex">
      <LoginBrandPanel />

      {/* Right — login interface */}
      <section
        aria-label="Login"
        className="flex flex-1 items-center justify-center bg-white px-5 py-14 sm:px-8 lg:min-h-screen lg:py-10"
      >
        <div className={cn("w-full", view === "select" ? "max-w-[620px]" : "max-w-[440px]")}>
          {view === "select" ? (
            <>
              <header className="text-center">
                <h1 className="font-display text-[26px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[30px]">
                  Login to Your Account
                </h1>
                <p className="mt-2 text-[14px] text-[#666666] sm:text-[15px]">
                  Choose how you want to continue
                </p>
              </header>

              {/* Role selection */}
              <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <LoginRoleCard role="farmer" onSelect={() => setView("farmer")} />
                <LoginRoleCard role="buyer" onSelect={() => setView("buyer")} />
              </div>

              {/* OR divider */}
              {/* <div className="my-8 flex items-center gap-4" role="separator" aria-orientation="horizontal">
                <span className="h-px flex-1 bg-[#E1E5E1]" aria-hidden="true" />
                <span className="text-[11.5px] font-semibold tracking-[0.22em] text-[#999999]">OR</span>
                <span className="h-px flex-1 bg-[#E1E5E1]" aria-hidden="true" />
              </div>

              <MobileLoginOption /> */}

              <p className="mt-7 text-center text-[14px] text-[#666666]">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]"
                >
                  Sign Up Now
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* Back / change role */}
              <button
                type="button"
                onClick={() => setView("select")}
                aria-label="Back to role selection"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#666666] transition-colors hover:text-[#2E7D32]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <div className="mt-6">
                {view === "farmer" ? <FarmerLoginForm /> : <BuyerLoginForm />}
              </div>
            </>
          )}

          {/* Security footer */}
          <footer className="mt-10 flex flex-col items-center gap-2 text-center">
            <p className="flex items-center gap-2 text-[12.5px] font-medium text-[#555555]">
              <ShieldCheck className="h-4 w-4 text-[#2E7D32]" strokeWidth={2.2} />
              Your data is 100% secure with us
            </p>
            <p className="text-[12px] text-[#888888]">Available in: मराठी | हिंदी | English</p>
          </footer>
        </div>
      </section>
    </main>
  );
}
