import { User, UserCredential } from "firebase/auth";
import { FieldValue } from "firebase/firestore";

export type UserType =
  | ({
      uid: string;
      displayName: string;
    } & UserCredential &
      User)
  | null;

export type MemberType = {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
};

export type RoomType = {
  roomId?: string;
  members?: MemberType[]
  memberIds?: string[]
  createdAt?: FieldValue
  isGroup?: boolean
  createdUser?: string;
}

export type MessageType = {
  senderId: string,
  content: string,
  createdAt: FieldValue,
  read: boolean
}