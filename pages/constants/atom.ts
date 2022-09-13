import { atom, RecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

export type Record = {
  key: string;
  value: string;
  createdAt: string;
  userName: string
  userImage: string
};

export type User = {
  email: string | null;
  uid: string;
  displayName: string | null;
  photoURL: string | null
};

const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: typeof window === "undefined" ? undefined : sessionStorage,
});

export const recordListState: RecoilState<Record[]> = atom({
  key: "record",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const userItemState: RecoilState<User> = atom({
  key: "user",
  default: {},
  effects_UNSTABLE: [persistAtom],
});
