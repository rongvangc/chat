import { auth } from "@/config";
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { create } from "zustand";

interface LoginType {
  email: string;
  password: string;
}

interface LoginState {
  errAuth: boolean;
  user: UserCredential | User | null;
  setUser: (user: UserCredential | User | null) => void;
  setAuthErr: (data: boolean) => void;
  handleSignIn: (data: LoginType) => void;
  handleSignOut: () => void;
}

const useAuthStore = create<LoginState>((set) => ({
  user: null,
  errAuth: false,
  setAuthErr: (data) =>
    set((state) => ({
      ...state,
      errAuth: data,
    })),
  setUser: (user: UserCredential | User | null) => set(() => ({ user })),
  handleSignOut: async () => {
    await signOut(auth);
    set({ user: null });
  },
  handleSignIn: async ({ email, password }: LoginType) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      set((state) => ({
        ...state,
        user,
        errAuth: false,
      }));
    } catch (error) {
      set({ errAuth: true, user: null });
    }
  },
  handleRegister: async ({ email, password }: LoginType) => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      set((state) => ({
        ...state,
        user,
      }));
    } catch (error) {
      set({ errAuth: true, user: null });
    }
  },
}));

export default useAuthStore;
