import { Box, Fab, TextField } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Send";
import { useSetRecoilState } from "recoil";
import { recordListState } from "../constants/atom";
import { useState } from "react";
import { format } from "date-fns";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const Form = () => {
  const setRecordList = useSetRecoilState(recordListState);
  const [inputValue, setInputValue] = useState({
    key: Math.floor(Math.random() * 1000).toString(16),
    value: "",
    createdAt: format(new Date(), "yyyy/MM/dd/hh/mm/ss"),
    userName: "",
    userImage: "",
  });

  //学習記録を投稿する機能
  const handleAddRecord = () => {
    if (inputValue.value === "") return;
    const { key, value, createdAt, userName, userImage } = inputValue;
    //データベースへデータ追加処理
    addDoc(collection(db, "records"), {
      key,
      value,
      createdAt,
      userName,
      userImage,
      timeStamp: serverTimestamp(),
    });
    //リストの更新処理
    setRecordList((recordList) => [
      ...recordList,
      { key, value, createdAt, userName, userImage },
    ]);
    //textFieldの初期化処理
    setInputValue({
      key: Math.floor(Math.random() * 1000).toString(16),
      value: "",
      createdAt: format(new Date(), "yyyy/MM/dd/hh/mm/ss"),
      userName: "",
      userImage: "",
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
        sx={{ width: 500, mx: "auto"}}
          style={{  }}
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
