import { User, UserCredential } from "firebase/auth";

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
