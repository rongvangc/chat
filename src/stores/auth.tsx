import { auth, db, storage } from "@/config";
import { UserType } from "@/lib/types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { create } from "zustand";

interface LoginType {
  email: string;
  password: string;
}

interface RegisterType extends LoginType {
  displayName: string;
  file: Blob | Uint8Array | ArrayBuffer;
}

interface AuthState {
  errAuth: boolean;
  user: UserType;
  loading: boolean;
  setUser: (user: UserType) => void;
  setAuthErr: (data: boolean) => void;
  handleSignIn: (data: LoginType) => void;
  handleRegister: (data: RegisterType) => void;
  handleSignOut: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  errAuth: false,
  loading: false,
  setAuthErr: (data) =>
    set((state) => ({
      ...state,
      errAuth: data,
    })),
  setUser: (user: UserType) => set(() => ({ user })),
  handleSignOut: async () => {
    await signOut(auth);
    set({ user: null });
  },
  handleSignIn: async ({ email, password }: LoginType) => {
    set((state) => ({
      ...state,
      loading: true,
    }));

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      set((state) => ({
        ...state,
        user: res.user as UserType,
        errAuth: false,
        loading: false,
      }));
    } catch (error) {
      set({ errAuth: true, user: null, loading: false });
    }
  },
  handleRegister: async ({
    email,
    password,
    displayName = "",
    file,
  }: RegisterType) => {
    set((state) => ({
      ...state,
      loading: true,
    }));

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
          } catch (err) {
            set({ errAuth: true, user: null, loading: false });
          }
        });
      });

      set((state) => ({
        ...state,
        user: res.user as UserType,
        loading: false,
      }));
    } catch (error) {
      set({ errAuth: true, user: null, loading: false });
    }
  },
}));

export default useAuthStore;
