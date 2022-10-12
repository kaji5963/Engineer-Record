import Head from "next/head";
import AuthLayout from "../components/Layout/AuthLayout";
import React from "react";
import type { NextPage } from "next";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";


const Home: NextPage = () => {
  const router = useRouter();
  return (
    <>
    <AuthLayout>
      <Head>
        <title>Engineer Record</title>
      </Head>
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
      </AuthLayout>
    </>
  );
};

export default Home;
