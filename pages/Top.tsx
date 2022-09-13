import Layout from "./components/Layout";
import Head from "next/head";
import Form from "./components/Form";
import RecordList from "./components/RecordList";
import { Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { userItemState } from "./constants/atom";

const Top = () => {
  const userItem = useRecoilValue(userItemState);
  
  return (
    <Layout>
      <Head>
        <title>Engineer Record Top</title>
      </Head>
      <Typography
        sx={{ mx: "auto", mb: 2 }}
        component="h1"
        variant="h5"
        suppressHydrationWarning={true}
      >
        {userItem.displayName}
      </Typography>
      <Form />
      <RecordList />
    </Layout>
  );
};

export default Top;
