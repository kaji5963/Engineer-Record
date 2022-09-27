import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css'
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ComputerIcon from "@mui/icons-material/Computer";
import { Card, CardActions, CardContent } from "@mui/material";
import { grey } from '@mui/material/colors';

const Home: NextPage = () => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Engineer Record</title>
      </Head>
      <Box sx={{mx: "auto",display: "flex", flexDirection: "column",justifyContent: "center" }}>
        <Box sx={{ display: "flex" }}>
          <AppBar component="nav">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <ComputerIcon
                sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
              />

              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, fontSize: 22,display: { xs: "none", sm: "block" } }}
              >
                Engineer Record
              </Typography>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Button
                  sx={{ color: "#fff",fontSize: 16, ":hover": {color: grey[400]} }}
                  onClick={() => router.push("/Signup")}
                >
                  新規登録
                </Button>
                <Button
                  sx={{ color: "#fff",fontSize: 16, ":hover": {color: grey[400]} }}
                  onClick={() => router.push("/Signin")}
                >
                  ログイン
                </Button>
                <Button sx={{ color: "#fff",fontSize: 16, ":hover": {color: grey[400]} }}>使い方</Button>
              </Box>
            </Toolbar>
          </AppBar>
          <Toolbar sx={{ mb: 4 }} />
        </Box>

        <Box
          sx={{
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            mt: 6,
          }}
        >
          <Typography sx={{ mx: "auto", mb: 3 }} variant="h4">
            Engineer Recordへようこそ
          </Typography>
          <Typography sx={{ mx: "auto", mb: 2 }} variant="h5">
            学習記録を積み上げませんか？
          </Typography>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2, width: 200, mx: "auto", fontSize: 18 }}
            onClick={() => router.push("/Signup")}
          >
            Get Started
          </Button>
        </Box>

        {/* <Box sx={{ display: "flex", justifyContent: 'space-around', mt: 8 }}>
          <Card variant="outlined" sx={{ minWidth: 320, display: "flex" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 18,mb: 1.5 }}
                color="text.secondary"
              >
                こんな方に向いています
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.5 }} >
              ・プログラミング学習中の方
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.5 }} >
              ・プログラミング学習中の方
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.5 }} >
              ・プログラミング学習中の方
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ minWidth: 320 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 18 }}
                color="text.secondary"
                gutterBottom
              >
                こんな方に向いています
              </Typography>
              <Typography variant="h5" component="div"></Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                adjective
              </Typography>
              <Typography variant="body2">
                well meaning and kindly.
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ minWidth: 320 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 18 }}
                color="text.secondary"
                gutterBottom
              >
                こんな方に向いています
              </Typography>
              <Typography variant="h5" component="div"></Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                adjective
              </Typography>
              <Typography variant="body2">
                well meaning and kindly.
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
          </Card>
        </Box> */}
      </Box>
    </>
  );
}

export default Home
