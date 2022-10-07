import Head from "next/head";
import Layout from "../../components/Layout";
import {
  Avatar,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { userItemState } from "../../constants/atom";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { updateProfile, User } from "firebase/auth";
import { auth, db, storage } from "../../components/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

const EditProfile = () => {
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  //全てのdisplayName,photoURLのアップロード処理
  const handleUpload = (
    e: FormEvent<HTMLFormElement>,
    displayName: string | null,
    photoURL: string
  ) => {
    e.preventDefault();
    if (!userItem.displayName) return;
    //ユーザー情報の更新
    updateProfile(auth.currentUser as User, {
      displayName,
      photoURL,
    });
    //usersコレクションのドキュメント更新
    const recordUpdateDoc = doc(db, "users", userItem.uid);
    updateDoc(recordUpdateDoc, {
      displayName: userItem.displayName,
      photoURL: userItem.photoURL,
    });
    router.push("/Top");
  };

  //ファイル選択後、firebaseにアップロードしfirebaseからダウンロード処理
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (!file) return;
    const storageRef = ref(storage, "images/" + file.name);
    try {
      await uploadBytes(storageRef, file).then((snapshot) => {
        console.log("Uploaded a file!");
      });
      await getDownloadURL(storageRef).then((url) => {
        console.log("Downloaded a file!");
        setUserItem({ ...userItem, photoURL: url });
      });
    } catch {
      alert("画像の読み込みに失敗しました");
    }
  };

  return (
    <Layout>
      <Head>
        <title>Engineer Record EditProfile</title>
      </Head>
      {isClient && (
        <Box
          sx={{
            bgcolor: grey[300],
            minWidth: 400,
            maxWidth: 600,
            minHeight: 280,
            mx: "auto",
            p: 4,
            borderRadius: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          component="form"
          onSubmit={(e) =>
            handleUpload(e, userItem.displayName, userItem.photoURL)
          }
        >
          <Box>
            <Typography
              sx={{ textAlign: "center", mb: 4, mt: 2 }}
              variant="h6"
              gutterBottom
            >
              Profileを編集しますか？
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "white",
                maxWidth: 200,
                mx: "auto",
                borderRadius: 5,
                mt: 3,
                mb: 4,
                py: 4,
                pl: 7,
              }}
            >
              <Box>
                <Typography
                  sx={{ fontWeight: "bold", ml: 0.5 }}
                  variant="subtitle1"
                >
                  Avatar
                </Typography>

                <IconButton color="primary">
                  <label>
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={(e) => handleFileUpload(e)}
                    />
                    <Avatar
                      sx={{
                        cursor: "pointer",
                      }}
                      src={userItem.photoURL}
                    />
                  </label>
                </IconButton>
              </Box>

              <Tooltip title="Avatar Delete" placement="top-start" arrow>
                <IconButton
                  sx={{ ml: 3, mt: 4 }}
                  onClick={() => setUserItem({ ...userItem, photoURL: "" })}
                >
                  <HighlightOffIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box
            sx={{
              bgcolor: "white",
              maxWidth: 200,
              mx: "auto",
              height: 100,
              p: 4,
              pb: 4,
              borderRadius: 5,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}
              variant="subtitle1"
            >
              Display Name
            </Typography>

            <TextField
              sx={{
                textAlign: "center",
                mb: 3,
                bgcolor: "white",
              }}
              value={userItem.displayName}
              size="medium"
              onChange={(e) =>
                setUserItem({ ...userItem, displayName: e.target.value })
              }
            />
          </Box>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Tooltip title="Complete" placement="top-start" arrow>
              <span>
                <IconButton
                  sx={{ mr: 3, ml: 1 }}
                  color="primary"
                  type="submit"
                  onClick={() => router.push("/Top")}
                  disabled={userItem.displayName === "" ? true : false}
                >
                  <CheckCircleIcon fontSize="large" />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Cancel" placement="top-start" arrow>
              <span>
              <IconButton
                color="primary"
                onClick={() => router.push(`/${userItem.uid}/Profile`)}
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

export default EditProfile;
