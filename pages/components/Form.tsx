import { Box, Fab, TextField } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Send";
import { useRecoilState, useSetRecoilState } from "recoil";
import { recordListState, userItemState } from "../constants/atom";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

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
    id: "",
    key: uuidv4(),
    value: "",
    createdAt: changeDateFormat(new Date()),
    displayName: userItem.displayName,
    photoURL: userItem.photoURL,
    saved: false
  });

  //学習記録を投稿する機能
  const handleAddRecord = () => {
    if (inputValue.value === "") return;
    const { id ,key, value, createdAt, displayName, photoURL, saved } = inputValue;
    // const { key, value, createdAt } = inputValue;
    //データベースへデータ追加処理
    addDoc(collection(db, "records"), {
      key,
      value,
      createdAt,
      displayName,
      photoURL,
      saved,
      timeStamp: serverTimestamp(),
    });
    //リストの更新処理
    setRecordList((recordList) => [
      ...recordList,
      // { key, value, createdAt },
      { id, key, value, createdAt, displayName, photoURL, saved },
    ]);
    //textFieldの初期化処理
    setInputValue({
      id: "",
      key: uuidv4(),
      value: "",
      createdAt: changeDateFormat(new Date()),
      displayName: userItem.displayName,
      photoURL: userItem.photoURL,
    saved: false
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
            // setInputValue({ ...inputValue, value: e.target.value, displayName: userItem.displayName })
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
