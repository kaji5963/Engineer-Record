import Layout from "./components/Layout";
import Head from "next/head";
import Form from "./components/Form";
import RecordList from "./components/RecordList";
import { Avatar, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { userItemState } from "./constants/atom";
import { Box } from "@mui/system";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Top = () => {
  const userItem = useRecoilValue(userItemState);
  
  return (
    <Layout>
      <Head>
        <title>Engineer Record Top</title>
      </Head>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Avatar sx={{ m: 1 }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5" suppressHydrationWarning={true}>
          {userItem.displayName}
        </Typography>
      </Box>
      <Form />
      <RecordList />
    </Layout>
  );
};

export default Top;
