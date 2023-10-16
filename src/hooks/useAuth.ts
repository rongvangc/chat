import { auth } from "@/config";
import { UserType } from "@/lib/types";
import useAuthStore from "@/stores/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  // Listen for Authentication Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user as UserType);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/chat");
    } else {
      navigate("/");
    }
  }, [navigate, user]);
};
