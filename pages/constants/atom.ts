import { atom, RecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

export type Record = {
  id: string
  key: string;
  value: string;
  createdAt: string;
  displayName: string | null;
  photoURL: string;
  saved: boolean
};

export type User = {
  email: string
  uid: string | null;
  displayName: string | null;
  photoURL: string;
};

export type RecordItem = {
  id: string
  key: string;
  value: string;
  createdAt: string;
  displayName: string | null;
  photoURL: string;
  saved: boolean
};

export type commentList = {
  id: string
  key: string;
  value: string;
  createdAt: string;
  displayName: string | null;
  photoURL: string;
};

// export type bookmark = {
//   id: string
//   key: string;
//   value: string;
//   createdAt: string;
//   displayName: string | null;
//   photoURL: string ;
//   saved: boolean
// };

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
  key: "userInformation",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const recordItemState: RecoilState<RecordItem> = atom({
  key: "commentItem",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const commentListState: RecoilState<commentList[]> = atom({
  key: "commentList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

// export const bookmarkState: RecoilState<bookmark> = atom({
//   key: "saved",
//   default: {},
//   effects_UNSTABLE: [persistAtom],
// });
