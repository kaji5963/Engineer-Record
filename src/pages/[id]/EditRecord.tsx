import Head from "next/head";
import TopLayout from "../../components/Layout/TopLayout";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import { useRecoilState, useRecoilValue } from "recoil";
import { editItemState, userItemState } from "../../constants/atom";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "../../components/firebase";
import { useRouter } from "next/router";

const EditRecord = () => {
  const [editItem, setEditItem] = useRecoilState(editItemState);
  const userItem = useRecoilValue(userItemState);
  const router = useRouter();

  //Record編集完了処理
  const handleEditComplete = (postId: string) => {
    if (editItem.value === "") return;
    const batch = writeBatch(db);
    const recordUpdateDoc = doc(db, "users", userItem.uid, "records", postId);
    batch.update(recordUpdateDoc, {
      value: editItem.value,
    });
    batch.commit();
    router.back();
  };

  return (
    <TopLayout>
      <Head>
        <title>Engineer Record EditRecord</title>
      </Head>
      <Box
        sx={{
          display: "flex",
          mt: 10,
          bgcolor: grey[300],
          height: 400,
          minWidth: 360,
          maxWidth: 500,
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
          Recordを編集しますか？
        </Typography>
        <Box>
          <TextField
            sx={{ minWidth: 360, maxWidth: 500, mx: "auto", bgcolor: "white" }}
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
              onClick={() => handleEditComplete(editItem.postId)}
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
    </TopLayout>
  );
};

export default EditRecord;
