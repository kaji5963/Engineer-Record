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

const EditComment = () => {
  const [editItem, setEditItem] = useRecoilState(editItemState);
  const router = useRouter();

  //comment編集完了処理
  const handleEditComplete = (id: string) => {
    if (editItem.value === "") return
    const commentUpdateDoc = doc(db, "comments", id);
    updateDoc(commentUpdateDoc, {
      value: editItem.value,
    });
    router.back();
  };

  return (
    <Layout>
      <Head>
        <title>Engineer Record EditComment</title>
      </Head>
      <Typography sx={{ textAlign: "center" }} variant="h4" gutterBottom>
        Edit Comment
      </Typography>
      <Box
        sx={{ display: "flex" }}
        justifyContent="center"
        component="form"
        noValidate
        autoComplete="off"
      >
        <TextField
          sx={{ width: 500, mx: "auto", bgcolor: "white" }}
          id="outlined-multiline-static"
          multiline
          rows={5}
          type="text"
          value={editItem.value}
          onChange={(e) => setEditItem({ ...editItem, value: e.target.value })}
        />
      </Box>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Tooltip title="Complete" placement="bottom-start" arrow>
          <IconButton
            sx={{ mr: 3 }}
            color="primary"
            type="submit"
            onClick={() => handleEditComplete(editItem.id)}
          >
            <CheckCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Back" placement="bottom-start" arrow>
          <IconButton
            sx={{ ml: 3 }}
            color="primary"
            onClick={() => router.back()}
          >
            <ReplyIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
    </Layout>
  );
};

export default EditComment;
