import ReplyIcon from "@mui/icons-material/Reply";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Head from "next/head";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { editItemState, userItemState } from "../../constants/atom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../components/firebase";
import { grey } from "@mui/material/colors";

const EditRecord = () => {
  const [editItem, setEditItem] = useRecoilState(editItemState);
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const router = useRouter();
console.log(editItem);

  //Record編集完了処理
  const handleEditComplete =  (id: string) => {
    if (editItem.value === "") return;
    const recordUpdateDoc = doc(db, "users", userItem.uid, "records", id);
    updateDoc(recordUpdateDoc, {
      value: editItem.value,
    });
    router.back();
  };

  return (
    <Layout>
      <Head>
        <title>Engineer Record EditRecord</title>
      </Head>
      <Box
        sx={{
          display: "flex",
          mt: 10,
          bgcolor: grey[300],
          height: 300,
          minWidth: 400,
          maxWidth: 700,
          flexDirection: "column",
          mx: "auto",
          textAlign: "center",
          p: 5,
          pb: 2,
          borderRadius: 5,
        }}
        justifyContent="center"
        component="form"
        noValidate
        autoComplete="off"
      >
        <Box>
          <TextField
            sx={{ minWidth: "80%", maxWidth: "80%", mx: "auto", bgcolor: "white" }}
            id="outlined-multiline-static"
            multiline
            rows={5}
            type="text"
            value={editItem.value}
            onChange={(e) =>
              setEditItem({ ...editItem, value: e.target.value })
            }
          />
        </Box>
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Tooltip title="Complete" placement="bottom-start" arrow>
            <IconButton
              sx={{ mr: 4 }}
              color="primary"
              type="submit"
              onClick={() => handleEditComplete(editItem.id)}
            >
              <CheckCircleIcon fontSize="large" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Back" placement="bottom-start" arrow>
            <IconButton
              sx={{ ml: 4 }}
              color="primary"
              onClick={() => router.back()}
            >
              <ReplyIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Layout>
  );
};

export default EditRecord;
