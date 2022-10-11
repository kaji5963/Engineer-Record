import { atom, RecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

export type User = {
  email: string;
  uid: string;
  displayName: string ;
  photoURL: string;
};

export type UserData = {
  displayName: string;
  photoURL: string;
  uid: string;
}[];

export type RecordList = {
  authorId: string;
  id: string;
  postId: string;
  value: string;
  createdAt: string;
  displayName: string;
  photoURL: string;
  goodCount: number
};

export type CommentItem = {
  uid: string;
  id: string;
  postId: string;
  value: string;
  createdAt: string;
  displayName: string ;
  photoURL: string;
};

export type EditItem = {
  uid: string;
  id: string;
  postId: string;
  value: string;
  createdAt: string;
  displayName: string ;
  photoURL: string;
};

const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: typeof window === "undefined" ? undefined : sessionStorage,
});

//ユーザー情報を保持
export const userItemState: RecoilState<User> = atom({
  key: "user",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

//ユーザー情報をリスト保持
export const userDataState: RecoilState<UserData> = atom({
  key: "userData",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

//学習記録をリスト保持
export const recordListState: RecoilState<RecordList[]> = atom({
  key: "recordList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

//コメント時の投稿者のデータを保持
export const commentItemState: RecoilState<CommentItem> = atom({
  key: "commentItem",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

//編集時のデータを保持(record,comment編集時に使用)
export const editItemState: RecoilState<EditItem> = atom({
  key: "editItem",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

//学習記録削除時にcommentのidを格納
export const commentExistState: RecoilState<{ id: string }[]> = atom({
  key: "commentExistList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});