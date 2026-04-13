import { createContext } from "react";

export type AuthSurfaceValue = {
  authRequired: boolean;
  signOut: () => Promise<void>;
  /** Present when app auth is on and user is signed in */
  role: "super" | "guest" | null;
};

export const AuthSurfaceContext = createContext<AuthSurfaceValue | null>(null);
