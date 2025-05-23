"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider, // Added
  signInWithPopup, // Added
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

type UserRole = "admin" | "user";

interface AuthUser extends User {
  role?: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  register: (
    email: string,
    password: string,
    name: string,
    isAdminRegister?: boolean
  ) => Promise<void>; // Added isAdminRegister
  login: (
    email: string,
    password: string,
    isAdminLogin?: boolean
  ) => Promise<void>; // Added isAdminLogin
  logout: () => Promise<void>;
  signInWithGoogle: (isAdminRegister?: boolean) => Promise<void>; // Added isAdminRegister
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Optionally fetch user role from Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        const role = userSnap.exists() ? userSnap.data().role : undefined;
        setUser({ ...firebaseUser, role });
        setIsAdmin(role === "admin"); // <-- set isAdmin here
      } else {
        setUser(null);
        setIsAdmin(false); // <-- reset isAdmin
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (
    email: string,
    password: string,
    name: string,
    isAdminRegister?: boolean
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });
    // Save user role in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role: isAdminRegister ? "admin" : "user",
      createdAt: new Date(),
    });
    // No need to manually sign in, Firebase does this automatically
  };

  const login = async (
    email: string,
    password: string,
    isAdminLogin?: boolean
  ) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Additional check for admin login
      if (isAdminLogin) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists() || userSnap.data()?.role !== 'admin') {
          await signOut(auth);
          // Throw a Firebase-like error object for consistency
          const error: any = new Error('Not authorized as admin');
          error.code = 'auth/not-authorized';
          throw error;
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error; // Make sure to re-throw the error
    }
  };

  const signInWithGoogle = async (isAdminRegister?: boolean) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: isAdminRegister ? "admin" : "user",
          createdAt: new Date().toISOString(),
        });
      } else if (isAdminRegister && userSnap.data().role !== "admin") {
        await setDoc(userRef, { role: "admin" }, { merge: true });
      }
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Google sign-in was cancelled.");
        return;
      }
      console.error("Error during Google sign-in:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  useEffect(() => {
    const allowlist = [
      "/",
      "/login",
      "/register",
      "/crimes",
      "/reports/map",
      "/stats",
      "/reports/anonymous",
      "/track",
      "/reports/new", // <-- allow anonymous access to report crime page
    ];
    // Allow /track and /track/[id] (dynamic)
    const isTrackRoute = pathname?.startsWith("/track");
    // Allow /reports/[id] for anonymous users (but not /reports/new)
    const isReportDetailRoute = pathname?.startsWith("/reports/") && !["/reports/new", "/reports/map", "/reports/anonymous"].includes(pathname);
    if (
      !loading &&
      !user &&
      !allowlist.includes(pathname) &&
      !isTrackRoute &&
      !isReportDetailRoute
    ) {
      router.push("/login");
    }
  }, [user, loading, router, pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        signInWithGoogle,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
