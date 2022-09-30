import Head from "next/head";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import { useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../components/firebase";
import { useRecoilState } from "recoil";
import { UserData, userItemState } from "../constants/atom";
import { blue } from "@mui/material/colors";
import Link from "next/link";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const router = useRouter();

  //SignIn処理
  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        //ユーザー情報取得処理しuserItemへ格納
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const { email, uid, displayName, photoURL } = user as UserData;
            setUserItem({ ...userItem, email, uid, displayName, photoURL });
          }
        });
        router.push("/Top");
      })
      .catch((error) => {
        alert(error.message);
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
            mt: 18,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: blue[300] }}>
            <LockOpenIcon />
          </Avatar>
          <Typography sx={{ mt: 2 }} component="h1" variant="h5">
            Login
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={(e) => handleSignIn(e)}
            sx={{ mt: 8 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontSize: 18 }}
            >
              ログイン
            </Button>
            <Grid sx={{ mt: 2, fontSize: 18}} container justifyContent="flex-end">
                <Link href="/Signup">
                  新規登録の方はこちら
                </Link>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SignIn;
