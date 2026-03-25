import { apiFetch } from "./api";

export async function logoutUser(logout: () => void, onComplete?: () => void) {
  try {
    await apiFetch("/api/v1/auth/logout", { method: "POST" });
  } finally {
    logout();
    onComplete?.();
  }
}
