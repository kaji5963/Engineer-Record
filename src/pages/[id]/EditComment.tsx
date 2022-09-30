import ReplyIcon from "@mui/icons-material/Reply";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GradingIcon from "@mui/icons-material/Grading";
import FactCheckIcon from "@mui/icons-material/FactCheck";
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
import { useEffect, useState } from "react";

const EditComment = () => {
  const [editItem, setEditItem] = useRecoilState(editItemState);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  //comment編集完了処理
  const handleEditComplete = (id: string) => {
    if (editItem.value === "") return;
    const commentUpdateDoc = doc(db, "comments", id);
    updateDoc(commentUpdateDoc, {
      value: editItem.value,
    });
    router.back();
  };

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  return (
    <Layout>
      <Head>
        <title>Engineer Record EditComment</title>
      </Head>
      {isClient && (
        <Box
          sx={{
            display: "flex",
            mt: 10,
            bgcolor: grey[300],
            height: 400,
            minWidth: 500,
            maxWidth: 700,
            flexDirection: "column",
            justifyContent: "center",
            mx: "auto",
            textAlign: "center",
            p: 5,
            pb: 2,
            borderRadius: 5,
          }}
          component="form"
          noValidate
          autoComplete="off"
        >
          <Typography
            sx={{ textAlign: "center", mb: 4 }}
            variant="h6"
            gutterBottom
          >
            Commentを編集しますか？
          </Typography>
          <Box>
            <TextField
              sx={{ width: 500, mx: "auto", bgcolor: "white" }}
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
                onClick={() => handleEditComplete(editItem.id)}
              >
                <FactCheckIcon fontSize="large" />
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
      )}
    </Layout>
  );
};

export default EditComment;
