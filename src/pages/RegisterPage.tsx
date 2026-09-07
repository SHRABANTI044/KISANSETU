import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import type { FormEvent, InputHTMLAttributes } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  CircleCheckBig,
  Eye,
  EyeOff,
  Languages,
  LoaderCircle,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sprout,
  Store,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import LoginBrandPanel from "../components/LoginBrandPanel";
import type { Role } from "../utils/authStore";
import { cn } from "../utils/cn";

/* ------------------------------- Demo data -------------------------------- */

const LANGUAGES = ["English", "हिंदी", "मराठी"];

type View = "form" | "google-demo" | "success";

/* ------------------------------ Field bits -------------------------------- */

function FieldError({ children }: { children: string }) {
  return (
    <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-[12px] font-medium text-red-600">
      <CircleAlert className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
      {children}
    </p>
  );
}

const regInput =
  "h-[52px] w-full rounded-xl border border-[#E1E5E1] bg-[#FAFBFA] pr-4 pl-11 text-[14.5px] text-[#111111] transition-colors outline-none placeholder:text-[#999999] focus:border-[#2E7D32] focus:bg-white";

function RegField({
  id,
  label,
  icon: Icon,
  error,
  ...inputProps
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-[#111111]">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-4 h-[17px] w-[17px] -translate-y-1/2 text-[#8A938A]" />
        <input id={id} className={cn(regInput, error && "border-red-400 focus:border-red-500")} {...inputProps} />
      </div>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  hint?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-[#111111]">
        {label}
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute top-1/2 left-4 h-[17px] w-[17px] -translate-y-1/2 text-[#8A938A]" />
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(regInput, "pr-12", error && "border-red-400 focus:border-red-500")}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-3 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-[#8A938A] transition-colors hover:bg-[#EAF6EA] hover:text-[#2E7D32]"
        >
          {show ? <EyeOff className="h-[18px] w-[18px]" strokeWidth={2} /> : <Eye className="h-[18px] w-[18px]" strokeWidth={2} />}
        </button>
      </div>
      {hint && !error && <p className="mt-1.5 text-[11.5px] text-[#888888]">{hint}</p>}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

function TermsCheckbox({
  id,
  checked,
  onChange,
  error,
}: {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug font-medium text-[#555555]">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[#2E7D32]"
        />
        <span>
          I agree to the{" "}
          <a href="#" onClick={(e) => e.preventDefault()} title="Placeholder — document coming soon" className="font-semibold text-[#2E7D32] hover:underline">
            Terms &amp; Conditions
          </a>{" "}
          and{" "}
          <a href="#" onClick={(e) => e.preventDefault()} title="Placeholder — document coming soon" className="font-semibold text-[#2E7D32] hover:underline">
            Privacy Policy
          </a>
        </span>
      </label>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

/* ------------------------------ Role cards -------------------------------- */

const ROLES: { value: Role; icon: LucideIcon; title: string; desc: string; circle: string }[] = [
  {
    value: "farmer",
    icon: Sprout,
    title: "I am a Farmer",
    desc: "Sell your produce, check market prices, get price predictions and connect with buyers.",
    circle: "bg-[#EAF6EA] text-[#2E7D32]",
  },
  {
    value: "buyer",
    icon: Store,
    title: "I am a Buyer",
    desc: "Find quality produce, post requirements and connect with farmers.",
    circle: "bg-[#E8F1FC] text-[#1976D2]",
  },
];

/* --------------------------------- Page ----------------------------------- */

export default function RegisterPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("form");
  const [role, setRole] = useState<Role | null>(null);
  const [roleError, setRoleError] = useState("");
  const [serverError, setServerError] = useState("");

  // manual form
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [creating, setCreating] = useState(false);
  const [createdName, setCreatedName] = useState("");

  const pickRole = (value: Role) => {
    setRole(value);
    setRoleError("");
    setErrors((e) => ({ ...e, role: "" }));
  };

  /* ------------------------------ Manual flow ----------------------------- */
  const validateManual = () => {
    const e: Record<string, string> = {};
    if (!role) e.role = "Please select Farmer or Buyer.";
    if (!fullName.trim()) e.fullName = "Please enter your full name.";
    if (!/^[6-9]\d{9}$/.test(mobile.trim())) e.mobile = "Please enter a valid mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) e.email = "Please enter a valid email address.";
    if (password.length < 8) e.password = "Password must be at least 8 characters.";
    if (confirmPassword !== password || !confirmPassword) e.confirmPassword = "Passwords do not match.";
    if (!language) e.language = "Please select your preferred language.";
    if (!terms) e.terms = "Please accept the Terms & Conditions.";
    return e;
  };

 const submitManual = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (creating) return;
  setServerError("");

  const e = validateManual();
  setErrors(e);
  if (role === null) setRoleError(e.role ?? "");
  if (Object.values(e).some(Boolean)) return;

  setCreating(true);

  try {
    // 1. Sign up user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              role: role,
              full_name: fullName.trim(),
              mobile: mobile.trim(),
              language: language || "English",
            },
          },
        });

          if (authError) throw authError;

          if (authData.user) {
            // 2. Insert base record in profiles table
            await supabase.from("profiles").upsert({
              id: authData.user.id,
              role: role,
              full_name: fullName.trim(),
              mobile: mobile.trim(),
              email: email.trim(),
              language: language || "English",
              profile_completed: false, // Incomplete!
            });
          }

          setCreatedName(fullName.trim());
          setView("success");
  } catch (err: any) {
    setServerError(err.message || "Failed to create account.");
  } finally {
    setCreating(false);
  }
};
  /* ------------- After success → role profile completion ------------------ */
    useEffect(() => {
  if (view !== "success" || !role) return;
  // Takes them directly to the form:
  const timer = window.setTimeout(() => navigate(`/${role}-profile`), 1800);
  return () => window.clearTimeout(timer);
}, [view, role, navigate]);

  return (
    <main className="min-h-screen bg-white lg:flex">
      <LoginBrandPanel />

      <section
        aria-label="Create your account"
        className="flex flex-1 items-center justify-center bg-white px-5 py-14 sm:px-8 lg:min-h-screen lg:py-10"
      >
        <div className="w-full max-w-[560px]">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#666666] transition-colors hover:text-[#2E7D32]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>

          {/* ------------------------------ FORM VIEW ------------------------------ */}
          {view === "form" && (
            <>
              <header className="mt-6">
                <h1 className="font-display text-[26px] font-bold tracking-[-0.01em] text-[#111111] sm:text-[30px]">
                  Create Your Account
                </h1>
                <p className="mt-2 text-[14px] text-[#666666] sm:text-[15px]">
                  Join Kishan Setu and connect with better markets, farmers and buyers.
                </p>
              </header>

              {/* Step 1 — choose role */}
              <div className="mt-8">
                <p className="text-[13px] font-semibold text-[#111111]">
                  Who are you? <span className="font-normal text-[#999999]">(select one)</span>
                </p>
                <div className="mt-3 grid grid-cols-1 gap-4 min-[430px]:grid-cols-2">
                  {ROLES.map((option) => {
                    const selected = role === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => pickRole(option.value)}
                        className={cn(
                          "relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-all duration-200",
                          selected
                            ? "border-[#2E7D32] bg-[#EAF6EA]/50 shadow-[0_10px_26px_-14px_rgba(46,125,50,0.45)]"
                            : "border-[#E1E5E1] bg-white hover:border-[#2E7D32]/40"
                        )}
                      >
                        {selected && (
                          <CircleCheckBig className="absolute top-3 right-3 h-5 w-5 text-[#2E7D32]" strokeWidth={2.2} />
                        )}
                        <span className={cn("grid h-12 w-12 place-items-center rounded-full", option.circle)}>
                          <option.icon className="h-[22px] w-[22px]" strokeWidth={2} />
                        </span>
                        <span className="font-display text-[15px] font-semibold text-[#111111]">{option.title}</span>
                        <span className="text-[12px] leading-relaxed text-[#666666]">{option.desc}</span>
                      </button>
                    );
                  })}
                </div>
                {roleError && <div className="mt-2"><FieldError>{roleError}</FieldError></div>}
              </div>
              {/* Method 2 — manual account creation */}
              <div className="mt-10 border-t border-[#E1E5E1] pt-8">
                <h2 className="font-display text-[17px] font-semibold text-[#111111]">Create Your Account</h2>
                <p className="mt-1 text-[13px] text-[#666666]">Enter your basic information to complete registration.</p>

                <form onSubmit={submitManual} className="mt-5 grid gap-4 sm:grid-cols-2" noValidate>
                  <RegField
                    id="reg-name"
                    label="Full Name"
                    icon={User}
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    error={errors.fullName}
                  />
                  <RegField
                    id="reg-mobile"
                    label="Mobile Number"
                    icon={Phone}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter your 10-digit mobile number"
                    error={errors.mobile}
                  />
                  <div className="sm:col-span-2">
                    <RegField
                      id="reg-email"
                      label="Email Address"
                      icon={Mail}
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      error={errors.email}
                    />
                  </div>
                  <PasswordField
                    id="reg-password"
                    label="Create Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Create a password"
                    error={errors.password}
                    hint="Minimum 8 characters."
                  />
                  <PasswordField
                    id="reg-confirm"
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Confirm your password"
                    error={errors.confirmPassword}
                  />
                  <div className="sm:col-span-2">
                    <label htmlFor="reg-language" className="mb-1.5 block text-[13px] font-semibold text-[#111111]">
                      Preferred Language
                    </label>
                    <div className="relative">
                      <Languages className="pointer-events-none absolute top-1/2 left-4 h-[17px] w-[17px] -translate-y-1/2 text-[#8A938A]" />
                      <select
                        id="reg-language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className={cn(
                          "h-[52px] w-full appearance-none rounded-xl border bg-[#FAFBFA] pr-4 pl-11 text-[14.5px] transition-colors outline-none focus:border-[#2E7D32] focus:bg-white",
                          errors.language ? "border-red-400" : "border-[#E1E5E1]",
                          language ? "text-[#111111]" : "text-[#999999]"
                        )}
                      >
                        <option value="" disabled>
                          Select your preferred language
                        </option>
                        {LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.language && <FieldError>{errors.language}</FieldError>}
                  </div>

                  <div className="sm:col-span-2">
                    <TermsCheckbox id="reg-terms" checked={terms} onChange={setTerms} error={errors.terms} />
                  </div>
                  {serverError && (
                    <div className="sm:col-span-2 rounded-xl bg-red-50 p-3 text-[13px] font-medium text-red-600">
                    {serverError}
                  </div>
)}

                  <button
                    type="submit"
                    disabled={creating}
                    aria-busy={creating}
                    className="mt-1 inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#2E7D32] text-[15px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:bg-[#256628] disabled:cursor-wait disabled:opacity-85 sm:col-span-2"
                  >
                    {creating ? (
                      <>
                        <LoaderCircle className="h-[18px] w-[18px] animate-spin" strokeWidth={2.4} />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="h-[17px] w-[17px]" strokeWidth={2.4} />
                      </>
                    )}
                  </button>
                </form>
              </div>

              <p className="mt-6 text-center text-[14px] text-[#666666]">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-[#2E7D32] transition-colors hover:text-[#155B32]">
                  Login
                </Link>
              </p>
            </>
          )}

          {/* ------------------------------ SUCCESS VIEW ----------------------------- */}
          {view === "success" && (
            <div className="animate-pop-in mt-10 flex flex-col items-center rounded-[22px] border border-[#E1E5E1] bg-white p-9 text-center shadow-[0_16px_44px_-18px_rgba(17,17,17,0.16)]">
              <span className="grid h-[76px] w-[76px] place-items-center rounded-full bg-[#EAF6EA]">
                <CircleCheckBig className="h-9 w-9 text-[#2E7D32]" strokeWidth={2.2} />
              </span>
              <h1 className="mt-5 font-display text-[23px] font-bold text-[#111111]">Account Created Successfully!</h1>
              <p className="mt-2 max-w-[380px] text-[13.5px] leading-relaxed text-[#666666]">
                Welcome aboard{createdName ? `, ${createdName.split(" ")[0]}` : ""}. Your {role} account has
                been created. Next, complete your {role} profile to unlock personalised
                recommendations.
              </p>
              <p className="mt-4 flex items-center gap-2 text-[12px] font-medium text-[#999999]">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                Taking you to profile setup...
              </p>
              <button
                type="button"
                onClick={() => role && navigate(`/${role}-profile`)} // <-- Directly opens the form!
                className="mt-6 inline-flex h-[50px] w-full max-w-[320px] items-center justify-center gap-2.5 rounded-xl bg-[#2E7D32] text-[14.5px] font-semibold text-white shadow-[0_12px_24px_-10px_rgba(46,125,50,0.55)] transition-all duration-200 hover:bg-[#256628]"
              >
                Complete Your Profile
                <ArrowRight className="h-[17px] w-[17px]" strokeWidth={2.4} />
              </button>
            </div>
          )}

          {/* Security footer — same family as the login page */}
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
