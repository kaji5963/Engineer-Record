import {
  Avatar,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import Head from "next/head";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { userItemState } from "../constants/atom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile, User } from "firebase/auth";
import { auth, db, storage } from "../components/firebase";
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
    //ユーザー情報の更新
    updateProfile(auth.currentUser as User, {
      displayName,
      photoURL,
    });
    //usersコレクションのドキュメント更新
    const recordUpdateDoc = doc(db, "users", userItem.uid);
    updateDoc(recordUpdateDoc, {
      displayName: userItem.displayName,
      photoURL: userItem.photoURL
    });

    setUserItem({ ...userItem, displayName, photoURL });
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
            bgcolor: grey[100],
            width: "50%",
            height: 320,
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
          {/* <Typography sx={{ textAlign: "center" }} variant="h4" gutterBottom>
            Edit Profile
          </Typography> */}
          <Box sx={{display: "flex", justifyContent: "center", alignContent: "center", width: 100, mx: "auto"}}>
            <Stack
              sx={{
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                mb: 2,
                ml: 9
              }}
            >
              <Typography sx={{ mx: "auto" }} variant="subtitle1">
                Avatar
              </Typography>

              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
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
              </IconButton>
            </Stack>

            <Box>
              <Tooltip title="Avatar Delete" placement="top-start" arrow>
                <IconButton
                  sx={{ ml: 3, mt: 5 }}
                  onClick={() => setUserItem({ ...userItem, photoURL: "" })}
                >
                  <HighlightOffIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box sx={{ mx: "auto" }}>
            <Typography sx={{ textAlign: "center", mb: 1 }} variant="subtitle1">
              Display Name
            </Typography>

            <TextField
              sx={{ textAlign: "center", mb: 3 }}
              id="filled-hidden-label-small"
              value={userItem.displayName}
              size="medium"
              onChange={(e) =>
                setUserItem({ ...userItem, displayName: e.target.value })
              }
            />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Tooltip title="Complete" placement="bottom-start" arrow>
              <IconButton
                sx={{ mr: 3 }}
                color="primary"
                type="submit"
                onClick={() => router.push("/Top")}
              >
                <CheckCircleIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Back" placement="bottom-start" arrow>
              <IconButton
                sx={{ ml: 3 }}
                color="primary"
                onClick={() => router.push("/Profile")}
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

export default EditProfile;
