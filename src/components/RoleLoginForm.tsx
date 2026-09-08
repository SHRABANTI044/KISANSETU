import { supabase } from "../lib/supabase";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link,useLocation,  useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Sprout,
  Store,
  User,
} from "lucide-react";
import { cn } from "../utils/cn";

export type LoginRole = "farmer" | "buyer";

const ROLE_CONFIG: Record<
  LoginRole,
  {
    icon: typeof Sprout;
    title: string;
    subtitle: string;
    button: string;
    dashboard: string;
    circleClass: string;
    buttonClass: string;
    accentClass: string;
    signUpClass: string;
    focusClass: string;
    checkboxClass: string;
  }
> = {
  farmer: {
    icon: Sprout,
    title: "Farmer Login",
    subtitle: "Access your farmer dashboard",
    button: "Login as Farmer",
    dashboard: "/farmer-dashboard",
    circleClass: "bg-[#EAF6EA] text-[#2E7D32]",
    buttonClass: "bg-[#2E7D32] hover:bg-[#256628] shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)]",
    accentClass: "text-[#2E7D32]",
    signUpClass: "text-[#2E7D32] hover:text-[#155B32]",
    focusClass: "focus:border-[#2E7D32]",
    checkboxClass: "accent-[#2E7D32]",
  },
  buyer: {
    icon: Store,
    title: "Buyer Login",
    subtitle: "Access your buyer dashboard",
    button: "Login as Buyer",
    dashboard: "/buyer/dashboard",
    circleClass: "bg-[#E8F1FC] text-[#1976D2]",
    buttonClass: "bg-[#1976D2] hover:bg-[#1560AE] shadow-[0_12px_24px_-10px_rgba(25,118,210,0.5)]",
    accentClass: "text-[#1976D2]",
    signUpClass: "text-[#1976D2] hover:text-[#125b9e]",
    focusClass: "focus:border-[#1976D2]",
    checkboxClass: "accent-[#1976D2]",
  },
};

const inputBase =
  "h-[52px] w-full rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] pr-4 pl-11 text-[14.5px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:bg-white";

/**
 * Shared role login form shown after a role card is selected.
 * Frontend-only demo: any non-empty credentials log in and route to the
 * role dashboard after a short "Logging in..." state.
 */
export default function RoleLoginForm({ role }: { role: LoginRole }) {
  const cfg = ROLE_CONFIG[role];
  const navigate = useNavigate();
  const location = useLocation(); 
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (loading) return;
  if (!identity.trim() || !password) {
    setError("Please enter your Email and Password.");
    return;
  }

  setError("");
  setLoading(true);

  try {
    // Supabase login with email and password
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: identity.trim(),
        password: password,
      });

      if (error) throw error;

            if (authData.user) {
        // Check profile_completed from database
        const { data: profile } = await supabase
          .from("profiles")
          .select("profile_completed, role")
          .eq("id", authData.user.id)
          .maybeSingle();

        // 1. Where did the user want to go? (Default to dashboard if none)
        const destination = (location.state as any)?.from || cfg.dashboard;

        if (profile && profile.profile_completed) {
          // 2. Profile is done -> Go directly to the clicked page (e.g. /market-prices)!
          navigate(destination);
        } else {
          // 3. Profile NOT completed -> Show intermediate page
          navigate("/complete-profile");
        }
      }
      }
  catch (err: any) {
    setError(err.message || "Invalid login credentials. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <article className="animate-pop-in rounded-[22px] border border-[#E1E5E1] bg-white p-7 shadow-[0_12px_34px_-16px_rgba(17,17,17,0.14)] sm:p-8">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <span className={cn("grid h-14 w-14 place-items-center rounded-full", cfg.circleClass)}>
          <cfg.icon className="h-[25px] w-[25px]" strokeWidth={2} />
        </span>
        <h1 className="mt-4 font-display text-[21px] font-bold text-[#111111]">{cfg.title}</h1>
        <p className="mt-1.5 text-[13.5px] text-[#666666]">{cfg.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col">
        {/* Email or Mobile Number */}
        <div>
          <label htmlFor={`${role}-identity`} className="mb-1.5 block text-[13px] font-semibold text-[#111111]">
            Email or Mobile Number
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-4 h-[17px] w-[17px] -translate-y-1/2 text-[#8A938A]" />
            <input
              id={`${role}-identity`}
              name="identity"
              type="text"
              autoComplete="username"
              required
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              placeholder="e.g. you@example.com / 98XXXXXX21"
              className={cn(inputBase, cfg.focusClass)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mt-4">
          <label htmlFor={`${role}-password`} className="mb-1.5 block text-[13px] font-semibold text-[#111111]">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-4 h-[17px] w-[17px] -translate-y-1/2 text-[#8A938A]" />
            <input
              id={`${role}-password`}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={cn(inputBase, "pr-12", cfg.focusClass)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-[#8A938A] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
            >
              {showPassword ? (
                <EyeOff className="h-[18px] w-[18px]" strokeWidth={2} />
              ) : (
                <Eye className="h-[18px] w-[18px]" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* Remember me + Forgot password */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <label htmlFor={`${role}-remember`} className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#555555]">
            <input
              id={`${role}-remember`}
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className={cn("h-4 w-4 rounded", cfg.checkboxClass)}
            />
            Remember Me
          </label>
          <Link to="/forgot-password" className={cn("text-[13px] font-semibold transition-colors hover:underline", cfg.accentClass)}>
            Forgot Password?
          </Link>
        </div>

        {/* Inline demo validation error */}
        {error && (
          <p role="alert" className="animate-pop-in mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-[12.5px] font-medium text-red-600">
            <CircleAlert className="h-4 w-4 shrink-0" strokeWidth={2.2} />
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className={cn(
            "mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold text-white transition-all duration-200 active:scale-[0.99] disabled:cursor-wait disabled:opacity-85",
            cfg.buttonClass
          )}
        >
          {loading ? (
            <>
              <LoaderCircle className="h-[18px] w-[18px] animate-spin" strokeWidth={2.4} />
              Logging in...
            </>
          ) : (
            <>
              {cfg.button}
              <ArrowRight className="h-[17px] w-[17px]" strokeWidth={2.4} />
            </>
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-[13.5px] text-[#666666]">
        Don&apos;t have an account?{" "}
        <Link to="/register" className={cn("font-semibold transition-colors", cfg.signUpClass)}>
          Sign Up Now
        </Link>
      </p>
    </article>
  );
}
