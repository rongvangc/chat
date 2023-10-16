import { db } from "@/config";
import { MemberType } from "@/lib/types";
import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { create } from "zustand";

interface ChatState {
  rooms: DocumentData[];
  getRooms: () => void;
  getRoomsUser: (member: MemberType) => void;
}

const useChatStore = create<ChatState>((set) => ({
  rooms: [],
  getRooms: async () => {
    const docSnap = await getDocs(collection(db, "rooms"));

    let docs: DocumentData[] = [];
    docSnap.forEach((doc) => {
      docs = docs.concat(doc.data());
    });

    set((state) => ({
      ...state,
      rooms: docs,
    }));
  },
  getRoomsUser: async (member: MemberType) => {
    const q = query(
      collection(db, "rooms"),
      where(
        "members",
        "array-contains",
        JSON.stringify({
          displayName: "Shyn",
          email: "info@gmail.com",
          photoURL:
            "https://firebasestorage.googleapis.com/v0/b/chat-f60b9.appspot.com/o/Shyn1696758275815?alt=media&token=bc0efe10-a146-4785-97df-f9c0fefcf4f5",
          uid: "6uZ8lQwRSfaJLTJ1XSxXKKatFX02",
        })
      )
    );

    console.log(
      JSON.stringify({
        displayName: "Shyn",
        email: "info@gmail.com",
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/chat-f60b9.appspot.com/o/Shyn1696758275815?alt=media&token=bc0efe10-a146-4785-97df-f9c0fefcf4f5",
        uid: "6uZ8lQwRSfaJLTJ1XSxXKKatFX02",
      })
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });

    set((state) => ({
      ...state,
      rooms: [],
    }));
  },
}));

export default useChatStore;
