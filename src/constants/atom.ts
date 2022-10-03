import { atom, RecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

export type UserData = {
  email: string;
  uid: string;
  displayName: string ;
  photoURL: string;
};

export type RecordList = {
  uid: string;
  id: string;
  postId: string;
  value: string;
  createdAt: string;
  displayName: string ;
  photoURL: string;
};

export type CommentList = {
  uid: string;
  id: string;
  postId: string;
  commentId: string;
  value: string;
  createdAt: string;
  displayName: string ;
  photoURL: string;
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

export type LikeList = {
  uid: string;
  id: string;
  postId: string;
  value: string;
  createdAt: string;
  displayName: string ;
  photoURL: string;
};

export type BookmarkList = {
  uid: string;
  id: string;
  postId: string;
  value: string;
  createdAt: string;
  displayName: string ;
  photoURL: string;
  saved: boolean;
};

const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: typeof window === "undefined" ? undefined : sessionStorage,
});

//ユーザー情報を保持
export const userItemState: RecoilState<UserData> = atom({
  key: "user",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

//学習記録をリスト保持
export const recordListState: RecoilState<RecordList[]> = atom({
  key: "recordList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

//コメントをリスト保持
export const commentListState: RecoilState<CommentList[]> = atom({
  key: "commentList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

//コメント時のデータを保持
export const commentItemState: RecoilState<CommentItem> = atom({
  key: "commentItem",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

//編集時のデータを保持
export const editItemState: RecoilState<EditItem> = atom({
  key: "editItem",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

//goodのデータを保持
export const likeListState: RecoilState<LikeList[]> = atom({
  key: "likeList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
//ブックマークをリスト保持
export const bookmarkListState: RecoilState<BookmarkList[]> = atom({
  key: "bookmarkList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
