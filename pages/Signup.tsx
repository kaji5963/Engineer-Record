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
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "./components/firebase";
import { useRecoilState } from "recoil";
import { recordListState } from "./constants/atom";
import { addDoc, collection } from "firebase/firestore";
import { grey } from "@mui/material/colors";

const SignUp = () => {
  // const [userName, setUserName] = useRecoilState(userNameState);
  // const [userName, setUserName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    userName: "",
    photoUrl: "",
  });
  const [recordList, setRecordList] = useRecoilState(recordListState);

  const router = useRouter();

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, userName, photoUrl } = userInfo;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        updateProfile(user, {
          displayName: userName,
          photoURL: photoUrl,
        });
        console.log(user);

        // const user = userCredential.user;
        // const userData = {
        //   email: email,
        //   password: password,
        //   username: userName,
        //   photoUrl: photoUrl,
        //   uid: user.uid,
        // };
        // console.log(userData);

        // addDoc(collection(db, "users"), userData);
        // const [{ key, value, createdAt, userImage }] = recordList;

        //     setRecordList((recordList) => [
        //       ...recordList,
        //       { key, value, createdAt, userName: userName, userImage },
        //     ]);
        router.push("/Top");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
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
            <Grid item xs={12}>
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: grey[500],
                  mx: "auto",
                  mb: 2,
                  cursor: "pointer",
                }}
              >
                <PersonAddIcon />
              </Avatar>
              <TextField
                autoComplete="given-name"
                name="userName"
                required
                fullWidth
                id="userName"
                label="User Name"
                autoFocus
                onChange={(e) =>
                  setUserInfo({ ...userInfo, userName: e.target.value })
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
  );
};

export default SignUp;
