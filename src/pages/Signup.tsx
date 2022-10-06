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
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { blue, grey } from "@mui/material/colors";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, db, storage } from "../components/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Alert, IconButton, Tooltip } from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { User, userItemState } from "../constants/atom";
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

        //firebaseにusersコレクション作成 setDocでuser.uidを指定してドキュメントID作成
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          displayName,
          photoURL,
          timeStamp: serverTimestamp(),
        });

        //ユーザー情報取得処理しuserItemへ格納
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const { uid, email, displayName, photoURL } = user as User;
            setUserItem({ ...userItem, uid, email, displayName, photoURL });
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
    if (!file) return;
    const storageRef = ref(storage, "images/" + file.name);
    try {
      await uploadBytes(storageRef, file).then((snapshot) => {
        console.log("Uploaded a file!");
      });
      await getDownloadURL(storageRef).then((url) => {
        console.log("Downloaded a file!");
        setUserInfo({ ...userInfo, photoURL: url });
      });
    } catch {
      alert("画像の読み込みに失敗しました");
    }
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
            mt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 2, bgcolor: blue[300] }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h4">
            Sign Up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={(e) => handleSignUp(e)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
                {userInfo.photoURL === "" ? (
                  <>
                    <Tooltip title="Avatar Add" placement="top-start" arrow>
                      <IconButton
                        sx={{
                          // bgcolor: grey[300],
                          mt: 3,
                          ml: 10,
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
                          />
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(e)}
                            style={{ display: "none" }}
                            accept=".jpg, .jpeg, .png"
                          />
                        </label>
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="Avatar Add" placement="top-start" arrow>
                      <IconButton
                        sx={{
                          bgcolor: grey[200],
                          mt: 6,
                          ml: 10,
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
                            src={userInfo.photoURL}
                          />
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(e)}
                            style={{ display: "none" }}
                            accept=".jpg, .jpeg, .png"
                          />
                        </label>
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                <Grid>
                  <Tooltip title="Avatar Delete" placement="top-start" arrow>
                    <IconButton
                      sx={{ ml: 3, mt: 1 }}
                      onClick={() => setUserInfo({ ...userInfo, photoURL: "" })}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{ mb: 1 }}
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
                {userInfo.displayName === "" ? (
                  <Typography sx={{ mb: 1 }}>
                    好きな名前を入力してください
                  </Typography>
                ) : (
                  <Alert
                    sx={{ width: 140 }}
                    iconMapping={{
                      success: <CheckCircleOutlineIcon fontSize="inherit" />,
                    }}
                  >
                    Success
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{ mb: 1 }}
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
                {userInfo.email.length < 5 ? (
                  <Typography sx={{ mb: 1 }}>
                    メールアドレスを入力してください
                  </Typography>
                ) : (
                  <Alert
                    sx={{ width: 140 }}
                    iconMapping={{
                      success: <CheckCircleOutlineIcon fontSize="inherit" />,
                    }}
                  >
                    Success
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{ mb: 1 }}
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
                {userInfo.password.length < 6 ? (
                  <Typography>半角6文字以上で入力してください</Typography>
                ) : (
                  <Alert
                    sx={{ width: 140 }}
                    iconMapping={{
                      success: <CheckCircleOutlineIcon fontSize="inherit" />,
                    }}
                  >
                    Success
                  </Alert>
                )}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={
                userInfo.displayName === "" ||
                userInfo.email.length < 5 ||
                (userInfo.password.length < 6 && true)
              }
              sx={{ mt: 3, mb: 2, fontSize: 18 }}
            >
              新規登録
            </Button>
            <Grid
              sx={{ mt: 2, fontSize: 18 }}
              container
              justifyContent="flex-end"
            >
              <Link href="/Signin">登録している方はこちら</Link>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SignUp;
