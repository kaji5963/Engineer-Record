import { atom, RecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

export type Record = {
  key: string;
  value: string;
  createdAt: string;
  userName: string
  userImage: string
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

// export const recordValue: RecoilState<Record> = atom({
//   key: "value",
//   default: "",
//   effects_UNSTABLE: [persistAtom],
// });
