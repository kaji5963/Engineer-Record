import Head from "next/head";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, db, storage } from "./components/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { grey } from "@mui/material/colors";
import { IconButton } from "@mui/material";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { User, userItemState } from "./constants/atom";
import { useRecoilState } from "recoil";

type Info = {
  email: string;
  password: string;
  displayName: string | null;
  photoURL: string;
};

const SignUp = () => {
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [userInfo, setUserInfo] = useState<Info>({
    email: "",
    password: "",
    displayName: "",
    photoURL: "",
  });
  const router = useRouter();

  //SignUp処理、userInfoのデータをfirebaseへ格納
  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, displayName, photoURL } = userInfo;
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        //displayName,photoURLを更新
        await updateProfile(user, {
          displayName,
          photoURL,
        });
        //firebaseにusersコレクション作成
        await addDoc(collection(db, "users"), {
          displayName,
          photoURL,
          timeStamp: serverTimestamp(),
        });
        //ユーザー情報取得処理しuserItemへ格納
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const { uid, displayName, photoURL } = user as User;
            setUserItem({ ...userItem, uid, displayName, photoURL });
          }
        });
        //userInfoを初期化
        setUserInfo({
          email: "",
          password: "",
          displayName: "",
          photoURL: "",
        });
        router.push("/Top");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  //ファイル選択後、firebaseにアップロードしfirebaseからダウンロード処理
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const storageRef = ref(storage, "images/" + file.name);
    await uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a file!");
    });
    await getDownloadURL(storageRef).then((url) => {
      console.log("Downloaded a file!");
      setUserInfo({ ...userInfo, photoURL: url });
    });
  };

  return (
    <>
      <Head>
        <title>Engineer Record SignUp</title>
      </Head>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 2, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            新規登録
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={(e) => handleSignUp(e)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              {userInfo.photoURL === "" ? (
                <>
                  <IconButton
                    sx={{
                      mt: 4,
                      bgcolor: grey[200],
                      mx: "auto",
                      mb: 2,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <label>
                      <PersonAddIcon
                        sx={{
                          cursor: "pointer",
                        }}
                        fontSize="large"
                      />
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e)}
                        style={{ display: "none" }}
                        accept=".jpg, .jpeg, .png"
                      />
                    </label>
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    sx={{
                      mt: 4,
                      bgcolor: grey[200],
                      mx: "auto",
                      mb: 2,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <label>
                      <Avatar
                        sx={{
                          cursor: "pointer",
                        }}
                        src={userItem.photoURL}
                      />
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e)}
                        style={{ display: "none" }}
                        accept=".jpg, .jpeg, .png"
                      />
                    </label>
                  </IconButton>
                </>
              )}

              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="displayName"
                  required
                  fullWidth
                  id="displayName"
                  label="Display Name"
                  autoFocus
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, displayName: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, email: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, password: e.target.value })
                  }
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              新規登録
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/Signin" variant="body2">
                  登録している方はこちら
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SignUp;
