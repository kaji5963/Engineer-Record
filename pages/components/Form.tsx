import { Box, Fab, TextField } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Send";
import { useRecoilState } from "recoil";
import { recordListState } from "../constants/atom";
import { useState } from "react";
import { format } from "date-fns";

const Form = () => {
  const [recordList, setRecordList] = useRecoilState(recordListState);
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
    setRecordList((recordList) => [
      ...recordList,
      { key, value, createdAt, userName, userImage },
    ]);
    console.log(recordList);

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
          style={{ width: 500 }}
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
      <Box sx={{ display: "flex", mt: 4 }} justifyContent="center">
        <Fab variant="extended" onClick={handleAddRecord}>
          <NavigationIcon sx={{ mr: 1 }} />
          Record
        </Fab>
      </Box>
    </>
  );
};

export default Form;
