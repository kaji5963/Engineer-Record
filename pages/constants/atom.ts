import { atom, RecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

export type Record = {
  uid: string
  id: string
  key: string;
  value: string;
  createdAt: string;
  displayName: string | null;
  photoURL: string;
  saved: boolean
};

export type User = {
  email: string;
  uid: string;
  displayName: string;
  photoURL: string;
};

export type CommentItem = {
  uid: string
  id: string
  key: string;
  value: string;
  createdAt: string;
  displayName: string | null;
  photoURL: string;
  saved: boolean
};

export type CommentList = {
  uid: string
  id: string
  key: string;
  value: string;
  createdAt: string;
  displayName: string | null;
  photoURL: string;
};

export type EditItem = {
  uid: string
  id: string
  key: string;
  value: string;
  createdAt: string;
  displayName: string | null;
  photoURL: string;
  saved: boolean
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
//学習記録を保持
export const recordListState: RecoilState<Record[]> = atom({
  key: "recordList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

//ユーザー情報を保持
export const userItemState: RecoilState<User> = atom({
  key: "user",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

//コメントを押したときのデータを保持
export const commentItemState: RecoilState<CommentItem> = atom({
  key: "commentItem",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

//コメントを保持
export const commentListState: RecoilState<CommentList[]> = atom({
  key: "commentList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

//編集を押したときのデータを保持
export const editItemState: RecoilState<EditItem> = atom({
  key: "editItem",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

// export const bookmarkState: RecoilState<bookmark> = atom({
//   key: "saved",
//   default: {},
//   effects_UNSTABLE: [persistAtom],
// });
