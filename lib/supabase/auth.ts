import { supabase, isSupabaseConfigured } from "./client";
import { serverSignUpUser, serverLoginUser, seedAdminAccount, createAdminUser as serverCreateAdminUser } from "./server-auth";

export interface UserSession {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  department_stream?: string;
  role: "student" | "admin";
  profile_completed?: boolean;
}

let serverSession: UserSession | null = null;
const STORAGE_KEY = "skillintern_session";

export const getStoredSession = (): UserSession | null => {
  if (typeof window === "undefined") return serverSession;
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const setStoredSession = (session: UserSession | null) => {
  if (typeof window === "undefined") {
    serverSession = session;
    return;
  }
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    try {
      document.cookie = `skillintern_session=${encodeURIComponent(JSON.stringify(session))}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    } catch (e) {
      console.warn("Failed to set session cookie:", e);
    }
  } else {
    localStorage.removeItem(STORAGE_KEY);
    try {
      document.cookie = `skillintern_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    } catch (e) {
      console.warn("Failed to clear session cookie:", e);
    }
  }
};

export const updateStoredSessionFields = (fields: Partial<UserSession>) => {
  const current = getStoredSession();
  if (current) {
    const updated = { ...current, ...fields };
    setStoredSession(updated);
  }
};

// -------------------------------------------------------------
// VALIDATION HELPERS
// -------------------------------------------------------------
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-]{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ""));
}

// -------------------------------------------------------------
// SIGN UP LOGIC
// -------------------------------------------------------------
export async function signUpUser(
  email: string,
  password: string,
  fullName: string,
  phoneNumber: string
) {
  // Input Validations
  if (!email || !password || !fullName || !phoneNumber) {
    throw new Error("All fields are required.");
  }
  if (!validateEmail(email)) {
    throw new Error("Invalid email format.");
  }
  if (!validatePhoneNumber(phoneNumber)) {
    throw new Error("Invalid phone number. Must be 10 to 15 digits.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }
  const hasCapital = /[A-Z]/.test(password);
  const hasSmall = /[a-z]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const hasNumeric = /[0-9]/.test(password);
  if (!hasCapital || !hasSmall || !hasSymbol || !hasNumeric) {
    throw new Error("Password must contain a combination of uppercase letters, lowercase letters, numbers, and symbols.");
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      return await serverSignUpUser(email, password, fullName, phoneNumber);
    } catch (err: any) {
      console.warn("Supabase custom signup failed, falling back to mock registration:", err);
      // If table profiles doesn't exist, we fall back to mock signup so the UI works
      if (err.message.includes("does not exist") || err.message.includes("schema cache")) {
        return signUpMockUser(email, password, fullName, phoneNumber);
      }
      throw err;
    }
  } else {
    return signUpMockUser(email, password, fullName, phoneNumber);
  }
}

// -------------------------------------------------------------
// LOGIN LOGIC
// -------------------------------------------------------------
export async function loginUser(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      // Auto-seed admin to Supabase DB if it's the admin logging in
      if (email.toLowerCase() === "admin@skillintern.com") {
        await seedAdminAccount();
      }

      const user = await serverLoginUser(email, password);
      
      const session: UserSession = {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
        department_stream: user.department_stream,
        role: user.role as "student" | "admin"
      };

      setStoredSession(session);
      return { user: session };
    } catch (err: any) {
      console.warn("Supabase custom login failed, checking fallback options:", err);
      if (err.message.includes("does not exist") || err.message.includes("schema cache")) {
        return loginMockUser(email, password);
      }
      throw err;
    }
  } else {
    return loginMockUser(email, password);
  }
}

// -------------------------------------------------------------
// FORGOT PASSWORD
// -------------------------------------------------------------
export async function forgotPassword(email: string) {
  if (!email) {
    throw new Error("Email address is required.");
  }
  if (!validateEmail(email)) {
    throw new Error("Invalid email format.");
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      // For custom authentication system, check if email exists in database
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (error) throw error;
      if (!profile) {
        throw new Error("Account not found. Please register first.");
      }

      // Return success indicating reset verification passed
      return { success: true };
    } catch (err: any) {
      if (err.message.includes("does not exist") || err.message.includes("schema cache")) {
        return { success: true }; // mock success
      }
      throw err;
    }
  } else {
    // Mock mode
    if (typeof window === "undefined") throw new Error("Mock operations only supported in browser");

    const profiles = JSON.parse(localStorage.getItem("mock_profiles") || "[]");
    const found = profiles.some((p: any) => p.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      throw new Error("Account not found. Please register first.");
    }

    return { success: true };
  }
}

// -------------------------------------------------------------
// LOGOUT
// -------------------------------------------------------------
export async function signOut() {
  setStoredSession(null);
}

// -------------------------------------------------------------
// CREATE ADMIN USER (client-facing wrapper — admin-only)
// -------------------------------------------------------------
export async function createAdminUser(
  callerEmail: string,
  newEmail: string,
  password: string,
  fullName: string,
  phoneNumber: string,
  departmentStream: string
) {
  if (isSupabaseConfigured() && supabase) {
    return serverCreateAdminUser(callerEmail, newEmail, password, fullName, phoneNumber, departmentStream);
  }
  // Mock fallback — only allow if caller is the mock admin
  const session = getStoredSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized: Only admins can create admin accounts.");
  }
  const profiles = JSON.parse(localStorage.getItem("mock_profiles") || "[]");
  if (profiles.some((p: any) => p.email === newEmail)) {
    throw new Error("An account with this email already exists.");
  }
  const newAdmin = {
    id: `mock-admin-${Math.random().toString(36).substr(2, 9)}`,
    email: newEmail,
    password,
    full_name: fullName,
    phone_number: phoneNumber,
    department_stream: departmentStream,
    role: "admin",
    created_at: new Date().toISOString(),
  };
  profiles.push(newAdmin);
  localStorage.setItem("mock_profiles", JSON.stringify(profiles));
  return { success: true };
}

// -------------------------------------------------------------
// DEV MODE TOGGLER
// -------------------------------------------------------------
export function devToggleRole() {
  const current = getStoredSession();
  if (!current) return;
  
  const newRole: "student" | "admin" = current.role === "admin" ? "student" : "admin";
  const updated: UserSession = { ...current, role: newRole };
  setStoredSession(updated);

  if (typeof window !== "undefined") {
    const profiles = JSON.parse(localStorage.getItem("mock_profiles") || "[]");
    const idx = profiles.findIndex((p: any) => p.id === current.id);
    if (idx !== -1) {
      profiles[idx].role = newRole;
      localStorage.setItem("mock_profiles", JSON.stringify(profiles));
    }
  }

  if (typeof window !== "undefined") {
    window.location.reload();
  }
}

// -------------------------------------------------------------
// CURRENT USER
// -------------------------------------------------------------
export async function getCurrentUser(): Promise<UserSession | null> {
  // Custom auth keeps session inside localStorage/stored session only
  return getStoredSession();
}

// -------------------------------------------------------------
// PRIVATE MOCK FALLBACK UTILITIES
// -------------------------------------------------------------
function signUpMockUser(
  email: string,
  password: string,
  fullName: string,
  phoneNumber: string
) {
  if (typeof window === "undefined") throw new Error("Mock registration only supported in browser");

  // Block reserved admin email from public registration
  if (email.toLowerCase() === "admin@skillintern.com") {
    throw new Error("This email address is reserved. Please use a different email.");
  }

  const mockId = `mock-user-${email.replace(/[^a-zA-Z0-9]/g, "")}`;
  const profiles = JSON.parse(localStorage.getItem("mock_profiles") || "[]");

  if (profiles.some((p: any) => p.email === email)) {
    throw new Error("An account with this email already exists.");
  }

  const newProfile = {
    id: mockId,
    email,
    password,
    full_name: fullName,
    phone_number: phoneNumber,
    role: "student",   // always student — admins are only created via createAdminUser
    profile_completed: false,
    created_at: new Date().toISOString(),
  };

  profiles.push(newProfile);
  localStorage.setItem("mock_profiles", JSON.stringify(profiles));

  return { success: true };
}

function loginMockUser(email: string, password: string) {
  if (typeof window === "undefined") throw new Error("Mock login only supported in browser");

  const ADMIN_EMAIL = "admin@skillintern.com";
  const ADMIN_PASSWORD = "Shiwam@99";

  let profiles: any[] = JSON.parse(localStorage.getItem("mock_profiles") || "[]");

  if (email.toLowerCase() === ADMIN_EMAIL) {
    const adminIdx = profiles.findIndex(
      (p: any) => p.email.toLowerCase() === ADMIN_EMAIL
    );

    if (adminIdx === -1) {
      // Admin doesn't exist yet — create it
      profiles.push({
        id: "mock-admin",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        full_name: "Super Admin",
        phone_number: "0000000000",
        department_stream: "Platform Administration",
        role: "admin",
        profile_completed: true,
        created_at: new Date().toISOString(),
      });
    } else {
      // Admin exists but may have a stale password from an older version —
      // always force-sync to the current canonical password & details.
      profiles[adminIdx] = {
        ...profiles[adminIdx],
        password: ADMIN_PASSWORD,
        full_name: "Super Admin",
        phone_number: "0000000000",
        department_stream: "Platform Administration",
        role: "admin",
        profile_completed: true,
      };
    }

    localStorage.setItem("mock_profiles", JSON.stringify(profiles));
  }

  const found = profiles.find(
    (p: any) => p.email.toLowerCase() === email.toLowerCase()
  );

  if (!found) {
    throw new Error("Account not found. Please register first.");
  }

  if (found.password !== password) {
    throw new Error("Wrong password.");
  }

  const session: UserSession = {
    id: found.id,
    email: found.email,
    full_name: found.full_name,
    phone_number: found.phone_number,
    department_stream: found.department_stream,
    role: found.role as "student" | "admin",
    profile_completed: found.profile_completed || false,
  };
  setStoredSession(session);
  return { user: session };
}
