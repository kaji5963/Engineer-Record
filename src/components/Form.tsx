import SendIcon from "@mui/icons-material/Send";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import { recordListState, userItemState } from "../constants/atom";
import { useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { grey } from "@mui/material/colors";

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
    postId: uuidv4(),
    value: "",
    createdAt: changeDateFormat(new Date()),
    displayName: userItem.displayName,
    photoURL: userItem.photoURL,
  });

  //学習記録を投稿する機能
  const handleAddRecord = async () => {
    if (inputValue.value === "") return;
    const { postId, value, createdAt, displayName, photoURL } =
      inputValue;
    const user = auth.currentUser!;

    //firebaseのrecordsへデータ格納（階層：users-uid-records）
    const formDocRef = doc(db, "users", user.uid, "records", postId);
    await setDoc(formDocRef, {
      uid: userItem.uid,
      postId,
      value,
      createdAt,
      // displayName,
      // photoURL,
      // saved,
      // likeCount: 0,
      timeStamp: serverTimestamp(),
    });
    //textFieldの初期化処理
    setInputValue({
      postId: uuidv4(),
      value: "",
      createdAt: changeDateFormat(new Date()),
      displayName: userItem.displayName,
      photoURL: userItem.photoURL,
    });
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: grey[200],
          borderRadius: 5,
          maxWidth: 500,
          mx: "auto",
          mb: 4,
          pt: 2,
          pb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: 5,
            mb: 3,
            pt: 1,
            mx: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ mr: 1 }} src={userItem.photoURL}></Avatar>
            <Typography sx={{ mx: 1 }} variant="h6">
              {userItem.displayName}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{ display: "flex" }}
          justifyContent="center"
          component="form"
          noValidate
          autoComplete="off"
        >
          <TextField
            sx={{ width: 400, mx: "auto", bgcolor: "white" }}
            id="outlined-multiline-static"
            label="学習記録を入力してくだい"
            multiline
            autoFocus
            rows={5}
            size="medium"
            type="text"
            value={inputValue.value}
            onChange={(e) =>
              setInputValue({ ...inputValue, value: e.target.value })
            }
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 3,
          }}
        >
          <Button
            sx={{ textTransform: "none", fontSize: 18, height: 40 }}
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleAddRecord}
            disabled={inputValue.value === "" ? true : false}
          >
            Record
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Form;
