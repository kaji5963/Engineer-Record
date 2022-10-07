import Head from "next/head";
import Layout from "../../components/Layout";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { grey } from "@mui/material/colors";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { editItemState } from "../../constants/atom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../components/firebase";
import React,{ useEffect, useState } from "react";

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
            minWidth: 400,
            maxWidth: 600,
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
              sx={{
                minWidth: 400,
                maxWidth: 500,
                mx: "auto",
                bgcolor: "white",
              }}
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
            <Tooltip title="Complete" placement="top-start" arrow>
              <span>
              <IconButton
                sx={{ mr: 3, ml: 1 }}
                color="primary"
                disabled={editItem.value === "" ? true : false}
                onClick={() => handleEditComplete(editItem.id)}
              >
                <CheckCircleIcon fontSize="large" />
              </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Cancel" placement="top-start" arrow>
              <span>
              <IconButton
                color="primary"
                onClick={() => router.back()}
              >
                <CancelIcon fontSize="large" />
              </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      )}
    </Layout>
  );
};

export default EditComment;
