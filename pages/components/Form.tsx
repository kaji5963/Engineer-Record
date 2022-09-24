import { Box, Fab, TextField } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Send";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  recordListState,
  userItemState,
} from "../constants/atom";
import { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { domainToASCII } from "url";
import { DockSharp } from "@mui/icons-material";

// Dateをyyyy-mm-dd hh:mm形式にフォーマット
export const changeDateFormat = (date: Date) => {
  return (
    date.getFullYear() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes()
  );
};

const Form = () => {
  const { v4: uuidv4 } = require("uuid");
  const setRecordList = useSetRecoilState(recordListState);
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [inputValue, setInputValue] = useState({
    key: uuidv4(),
    value: "",
    createdAt: changeDateFormat(new Date()),
    displayName: userItem.displayName,
    photoURL: userItem.photoURL,
    saved: false,
  });

  //学習記録を投稿する機能
  const handleAddRecord = async () => {
    if (inputValue.value === "") return;
    const { key, value, createdAt, displayName, photoURL, saved } =
      inputValue;
    const user = auth.currentUser!;

    //firebaseへデータ格納（階層：users-uid-records）
    const formDocRef = collection(db, "users", user.uid, "records");
    await addDoc(formDocRef, {
      uid: userItem.uid,
      key,
      value,
      createdAt,
      displayName,
      photoURL,
      saved,
      timeStamp: serverTimestamp(),
    });

    //firebaseからデータを取得、投稿されたデータをrecordListへ格納  〜  これ必要？？？
    // const q = query(formDocRef, orderBy("timeStamp", "desc"));
    // onSnapshot(
    //   q,
    //   (snapshot) =>
    //     setRecordList(
    //       snapshot.docs.map((doc) => ({
    //         ...doc.data(),
    //         uid: userItem.uid,
    //         id: doc.id, //削除処理などの際に指定するドキュメントidを追加
    //         key: doc.data().key,
    //         value: doc.data().value,
    //         createdAt: doc.data().createdAt,
    //         displayName: doc.data().displayName,
    //         photoURL: doc.data().photoURL,
    //         saved: doc.data().saved,
    //       }))
    //     ),
    //   (error) => {
    //     alert(error.message);
    //   }
    // );

    //textFieldの初期化処理
    setInputValue({
      key: uuidv4(),
      value: "",
      createdAt: changeDateFormat(new Date()),
      displayName: userItem.displayName,
      photoURL: userItem.photoURL,
      saved: false,
    });
  };

  return (
    <>
      <Box
        sx={{ display: "flex" }}
        justifyContent="center"
        component="form"
        noValidate
        autoComplete="off"
      >
        <TextField
          sx={{ width: 500, mx: "auto" }}
          id="outlined-multiline-static"
          label="学習記録を入力してくだい"
          multiline
          rows={5}
          type="text"
          value={inputValue.value}
          onChange={(e) =>
            setInputValue({ ...inputValue, value: e.target.value })
          }
        />
      </Box>
      <Box sx={{ display: "flex", my: 4, mx: "auto" }} justifyContent="center">
        <Fab variant="extended" onClick={handleAddRecord}>
          <NavigationIcon sx={{ mr: 1 }} />
          Record
        </Fab>
      </Box>
    </>
  );
};

export default Form;
