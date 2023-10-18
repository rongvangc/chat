import { db } from "@/config";
import { MessageType, RoomType } from "@/lib/types";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { create } from "zustand";

interface ChatState {
  rooms: RoomType[];
  messageByRoomId: MessageType[];
  selectedRoom: RoomType;
  showMobileDraw: boolean;
  setShowMobileDraw: (data: boolean) => void;
  setRooms: (data: RoomType) => void;
  getRoomsUser: (memberId: string) => void;
  setRoomSelect: (selectedRoom: RoomType) => void;
  getMessageByRoomId: (roomId: string) => void;
  setMessageByRoomId: (message: MessageType) => void;
}

const useChatStore = create<ChatState>((set) => ({
  rooms: [],
  selectedRoom: {},
  loading: false,
  messageByRoomId: [],
  showMobileDraw: false,
  setShowMobileDraw: (data) =>
    set((state) => ({
      ...state,
      showMobileDraw: data,
    })),
  setRooms: (data) =>
    set((state) => ({
      ...state,
      rooms: [data, ...state.rooms],
    })),
  getRoomsUser: async (memberId: string) => {
    const docs: RoomType[] = [];

    const q = query(
      collection(db, "rooms"),
      where("memberIds", "array-contains", memberId)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      docs.push(doc.data() as RoomType);
    });

    set((state) => ({
      ...state,
      rooms: docs,
    }));
  },
  getMessageByRoomId: async (roomId: string) => {
    const docs: MessageType[] = [];
    const querySnapshot = await getDocs(
      query(
        collection(db, "rooms", roomId, "messages"),
        orderBy("createdAt", "asc")
      )
    );

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      docs.push(doc.data() as MessageType);
    });

    set((state) => ({
      ...state,
      messageByRoomId: docs,
    }));
  },
  setMessageByRoomId: async (message: MessageType) => {
    set((state) => ({
      ...state,
      messageByRoomId: [...state.messageByRoomId, message],
    }));
  },
  setRoomSelect: async (selectedRoom) => {
    set((state) => ({
      ...state,
      selectedRoom,
      showMobileDraw: false,
    }));
  },
}));

export default useChatStore;
