import { useEffect, useState } from "react";
import {
  Bell,
  CircleAlert,
  Globe,
  KeyRound,
  Moon,
  Save,
  Settings,
  ShieldCheck,
  Smartphone,
  Sun,
  Trash2,
  User,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { cn } from "../../utils/cn";

/**
 * /dashboard/settings — dashboard preferences module.
 * Profile info, notifications, language & region, appearance, security
 * and account actions. Preferences persist in localStorage until the
 * real farmer settings API is connected.
 */

/* --------------------------------- Types --------------------------------- */

type NotificationPrefs = {
  newOrders: boolean;
  priceAlerts: boolean;
  paymentUpdates: boolean;
  smsUpdates: boolean;
  marketingEmails: boolean;
};

type SettingsState = {
  fullName: string;
  phone: string;
  email: string;
  village: string;
  district: string;
  language: string;
  currency: string;
  units: string;
  theme: "light" | "dark";
  notifications: NotificationPrefs;
};

const DEFAULT_SETTINGS: SettingsState = {
  fullName: "Ramesh Patel",
  phone: "+91 98765 43210",
  email: "ramesh.patel@example.com",
  village: "Rampur",
  district: "Nashik, Maharashtra",
  language: "English",
  currency: "INR (₹)",
  units: "Quintal",
  theme: "light",
  notifications: {
    newOrders: true,
    priceAlerts: true,
    paymentUpdates: true,
    smsUpdates: false,
    marketingEmails: false,
  },
};

const STORAGE_KEY = "kisansetu-settings";

function loadSettings(): SettingsState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<SettingsState>) };
  } catch {
    /* corrupted storage — fall back to defaults */
  }
  return DEFAULT_SETTINGS;
}

const LANGUAGES = ["English", "हिन्दी (Hindi)", "मराठी (Marathi)", "ਪੰਜਾਬੀ (Punjabi)", "ಕನ್ನಡ (Kannada)"];
const CURRENCIES = ["INR (₹)", "USD ($)"];
const UNITS = ["Quintal", "Kilogram", "Tonne"];

/* ------------------------------ Small bits ------------------------------- */

function Toggle({
  checked,
  onChange,
  label,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-[#E1E5E1] bg-white px-4 py-3.5">
      <div>
        <p className="text-[13.5px] font-semibold text-[#111111]">{label}</p>
        <p className="mt-0.5 text-[12px] text-[#777777]">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-[24px] w-[44px] shrink-0 rounded-full transition-colors",
          checked ? "bg-[#2E7D32]" : "bg-[#D5DDD5]"
        )}
      >
        <span
          className={cn(
            "absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all",
            checked ? "left-[23px]" : "left-[3px]"
          )}
        />
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-[#555555]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[42px] rounded-xl border border-[#E1E5E1] bg-white px-3.5 text-[13px] text-[#111111] outline-none transition-colors placeholder:text-[#999999] focus:border-[#2E7D32]"
      />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-[#555555]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[42px] appearance-none rounded-xl border border-[#E1E5E1] bg-white px-3.5 text-[13px] font-semibold text-[#444444] outline-none transition-colors focus:border-[#2E7D32]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function SectionCard({
  icon,
  title,
  desc,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E1E5E1] bg-[#FBFCFB] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EAF6EA] text-[#2E7D32]">{icon}</span>
        <div>
          <h2 className="font-display text-[16px] font-bold text-[#111111]">{title}</h2>
          <p className="mt-0.5 text-[12.5px] text-[#777777]">{desc}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/* ---------------------------------- Page ---------------------------------- */

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(loadSettings);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const update = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const updateNotification = (key: keyof NotificationPrefs, value: boolean) =>
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));

  const handleSave = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setToast("Settings saved successfully.");
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setToast("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setToast("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast("New passwords do not match.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setToast("Password updated successfully.");
  };

  const handleLogoutAll = () => setToast("Signed out of all devices.");

  const handleDeleteAccount = () =>
    setToast("Account deletion requires OTP verification — coming with the backend.");

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#EAF6EA] text-[#2E7D32]">
              <Settings className="h-5 w-5" strokeWidth={1.9} />
            </span>
            <div>
              <h1 className="font-display text-[20px] font-bold text-[#111111]">Settings</h1>
              <p className="text-[12.5px] text-[#777777]">Manage your profile, notifications and preferences.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className={cn(
              "flex h-[42px] items-center justify-center gap-2 rounded-xl px-5 text-[13px] font-bold transition-colors",
              saved ? "bg-[#EAF6EA] text-[#2E7D32]" : "bg-[#2E7D32] text-white hover:bg-[#256A29]"
            )}
          >
            {saved ? <ShieldCheck className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved" : "Save changes"}
          </button>
        </div>

        {/* Sections */}
        <div className="mt-7 grid gap-5">
          {/* Profile */}
          <SectionCard icon={<User className="h-5 w-5" />} title="Profile information" desc="Basic details shown on your crop lots and orders.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={settings.fullName} onChange={(v) => update("fullName", v)} />
              <Field label="Phone number" value={settings.phone} onChange={(v) => update("phone", v)} />
              <Field label="Email address" value={settings.email} onChange={(v) => update("email", v)} type="email" />
              <Field label="Village" value={settings.village} onChange={(v) => update("village", v)} />
              <Field label="District & State" value={settings.district} onChange={(v) => update("district", v)} />
            </div>
          </SectionCard>

          {/* Notifications */}
          <SectionCard icon={<Bell className="h-5 w-5" />} title="Notifications" desc="Choose what you want to be alerted about.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Toggle label="New orders" desc="When a buyer places an order" checked={settings.notifications.newOrders} onChange={(v) => updateNotification("newOrders", v)} />
              <Toggle label="Price alerts" desc="Mandi price changes for your crops" checked={settings.notifications.priceAlerts} onChange={(v) => updateNotification("priceAlerts", v)} />
              <Toggle label="Payment updates" desc="Settlement and payout status" checked={settings.notifications.paymentUpdates} onChange={(v) => updateNotification("paymentUpdates", v)} />
              <Toggle label="SMS updates" desc="Important alerts via text message" checked={settings.notifications.smsUpdates} onChange={(v) => updateNotification("smsUpdates", v)} />
              <Toggle label="Marketing emails" desc="Tips, offers and product news" checked={settings.notifications.marketingEmails} onChange={(v) => updateNotification("marketingEmails", v)} />
            </div>
          </SectionCard>

          {/* Language & region */}
          <SectionCard icon={<Globe className="h-5 w-5" />} title="Language & region" desc="App language, currency and measurement units.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Select label="Language" value={settings.language} options={LANGUAGES} onChange={(v) => update("language", v)} />
              <Select label="Currency" value={settings.currency} options={CURRENCIES} onChange={(v) => update("currency", v)} />
              <Select label="Weight unit" value={settings.units} options={UNITS} onChange={(v) => update("units", v)} />
            </div>
          </SectionCard>

          {/* Appearance */}
          <SectionCard icon={settings.theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />} title="Appearance" desc="How KisanSetu looks on this device.">
            <div className="flex gap-3">
              {(["light", "dark"] as const).map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => update("theme", theme)}
                  className={cn(
                    "flex flex-1 items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors",
                    settings.theme === theme ? "border-[#2E7D32] bg-[#EAF6EA]" : "border-[#E1E5E1] bg-white hover:bg-[#F4F6F4]"
                  )}
                >
                  {theme === "light" ? <Sun className="h-5 w-5 text-[#2E7D32]" /> : <Moon className="h-5 w-5 text-[#2E7D32]" />}
                  <span className="text-[13px] font-semibold capitalize text-[#111111]">{theme} mode</span>
                </button>
              ))}
            </div>
          </SectionCard>

          {/* Security */}
          <SectionCard icon={<KeyRound className="h-5 w-5" />} title="Security" desc="Update your password and manage devices.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Current password" value={currentPassword} onChange={setCurrentPassword} type="password" />
              <Field label="New password" value={newPassword} onChange={setNewPassword} type="password" />
              <Field label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} type="password" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handlePasswordChange}
                className="flex h-[40px] items-center gap-2 rounded-xl bg-[#2E7D32] px-4 text-[13px] font-bold text-white transition-colors hover:bg-[#256A29]"
              >
                <KeyRound className="h-4 w-4" />
                Update password
              </button>
              <button
                type="button"
                onClick={handleLogoutAll}
                className="flex h-[40px] items-center gap-2 rounded-xl border border-[#E1E5E1] bg-white px-4 text-[13px] font-semibold text-[#111111] transition-colors hover:bg-[#EAF6EA]"
              >
                <Smartphone className="h-4 w-4" />
                Sign out of all devices
              </button>
            </div>
          </SectionCard>

          {/* Danger zone */}
          <section className="rounded-2xl border border-[#F3D6D6] bg-[#FDF7F7] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FBE9E9] text-[#C0392B]">
                  <CircleAlert className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-[16px] font-bold text-[#111111]">Delete account</h2>
                  <p className="mt-0.5 max-w-md text-[12.5px] text-[#777777]">
                    Permanently remove your account, crop lots and order history. This action cannot be undone.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex h-[40px] shrink-0 items-center gap-2 rounded-xl border border-[#E5B4B4] bg-white px-4 text-[13px] font-bold text-[#C0392B] transition-colors hover:bg-[#C0392B] hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
                Delete account
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-[#111111] px-4 py-3 text-[13px] font-semibold text-white shadow-xl"
        >
          <ShieldCheck className="h-4 w-4 text-[#7BC97E]" />
          {toast}
        </div>
      )}
    </DashboardLayout>
  );
}
