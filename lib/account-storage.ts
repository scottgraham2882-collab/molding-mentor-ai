export type StoredUser = {
  name: string;
  email: string;
  role: string;
  company: string;
  joinedOn: string;
};

export const demoUser: StoredUser = {
  name: "Jordan Rivera",
  email: "jordan.rivera@example.com",
  role: "Process Technician",
  company: "Demo Molding Team",
  joinedOn: "Jun 2026",
};

export const userStorageKey = "moldingMentorUser";

export function getStoredUser(): StoredUser {
  if (typeof window === "undefined") {
    return demoUser;
  }

  const storedUser = window.localStorage.getItem(userStorageKey);

  if (!storedUser) {
    return demoUser;
  }

  try {
    return { ...demoUser, ...JSON.parse(storedUser) } as StoredUser;
  } catch {
    return demoUser;
  }
}

export function saveStoredUser(user: StoredUser) {
  window.localStorage.setItem(userStorageKey, JSON.stringify(user));
}
