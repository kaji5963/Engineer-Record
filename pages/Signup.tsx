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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "./components/firebase";
import { useRecoilState } from "recoil";
import { recordListState } from "./constants/atom";
import { addDoc, collection } from "firebase/firestore";
import { grey } from "@mui/material/colors";
import { IconButton } from "@mui/material";
import Head from "next/head";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

type Info = {
  email: string;
  password: string;
  displayName: string;
  photoURL: File | null;
};

const SignUp = () => {
  const [userInfo, setUserInfo] = useState<Info>({
    email: "",
    password: "",
    displayName: "",
    photoURL: null,
  });
  // const [recordList, setRecordList] = useRecoilState(recordListState);

  const router = useRouter();

  //SignUp処理、それぞれのデータをfirebaseとuserInfoへ格納
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, displayName, photoURL } = userInfo;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        //displayName,photoURLを更新し格納
        updateProfile(user, {
          displayName: displayName,
          // photoURL: photoURL,
        });
        //userInfoを初期化
        setUserInfo({
          email: "",
          password: "",
          displayName: "",
          photoURL: null,
        });

        router.push("/Top");
      })
      .catch((error) => {
        alert(error);
      });
    }
    // const user = userCredential.user;
    // const userData = {
    //   displayName: displayName,
    //   photoURL: photoURL,
    //   uid: user.uid,
    // };
    // console.log(userData);

    // addDoc(collection(db, "users"), userData);
    // const [{ key, value, createdAt, userImage }] = recordList;

    //     setRecordList((recordList) => [
    //       ...recordList,
    //       { key, value, createdAt, userName: userName, userImage },
    //     ]);


    
  // const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files![0];
  //   const storageRef = ref(storage, "image/" + file.name);
  //   uploadBytes(storageRef, file).then((snapshot) => {
  //     console.log("Uploaded a blob or file!");
  //   });
  //   setUserInfo({...userInfo, photoURL: file})
  // };

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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
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
                    // onChange={handleFileUpload}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, photoURL: e.target.files![0] })
                    }
                    style={{ display: "none" }}
                    accept=".jpg, .jpeg, .png"
                  />
                </label>
              </IconButton>
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
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
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
