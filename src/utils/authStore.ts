/**
 * Frontend-only demo persistence for the Kishan Setu auth flow.
 * Registration data, role and profile progress are kept in localStorage so
 * the demo survives reloads. Passwords are NEVER stored.
 */

export type Role = "farmer" | "buyer";

export interface RegistrationData {
  role: Role | null;
  method: "manual" | "google" | null;
  fullName: string;
  mobile: string;
  email: string;
  language: string;
}

const REGISTRATION_KEY = "kishansetu.registration";
const profileKey = (role: Role) => `kishansetu.profile.${role}`;

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — demo continues in memory */
  }
}

export function saveRegistration(data: RegistrationData): void {
  writeJson(REGISTRATION_KEY, data);
}

export function getRegistration(): RegistrationData | null {
  return readJson<RegistrationData>(REGISTRATION_KEY);
}

export function saveProfileData<T>(role: Role, data: T): void {
  writeJson(profileKey(role), data);
}

export function getProfileData<T>(role: Role): T | null {
  return readJson<T>(profileKey(role));
}
