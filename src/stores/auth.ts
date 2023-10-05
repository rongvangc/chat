import { create } from "zustand";

interface LoginState {
  name: string;
  phoneNumber: string;
  setHobbies: (hobbies: string[]) => void;
}

const useStore = create<LoginState>((set) => ({
  name: "",
  phoneNumber: "",
  setHobbies: (hobbies) =>
    set((state) => ({
      ...state,
      hobbies,
    })),
}));

export default useStore;
