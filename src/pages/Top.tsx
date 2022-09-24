import Layout from "../components/Layout";
import Head from "next/head";
import Form from "../components/Form";
import RecordList from "../components/RecordList";
import { Avatar, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { userItemState } from "../constants/atom";
import { Box } from "@mui/system";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useEffect, useState } from "react";

const Top = () => {
  const userItem = useRecoilValue(userItemState);
  const [isClient, setIsClient] = useState(false);

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);
  
  return (
    <Layout>
      <Head>
        <title>Engineer Record Top</title>
      </Head>
      {isClient && (
        <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Avatar
            sx={{ m: 1 }}
            src={userItem.photoURL}
            suppressHydrationWarning={true}
          >
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {userItem.displayName}
          </Typography>
        </Box>
        <Form />
        <RecordList />
        </>
      )}
    </Layout>
  );
};

export default Top;
