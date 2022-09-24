import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { grey } from "@mui/material/colors";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { useRecoilState } from "recoil";
import { userItemState } from "../constants/atom";
import { useEffect, useState } from "react";
import { auth } from "../components/firebase";

const Profile = () => {
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  return (
    <Layout>
      <Head>
        <title>Engineer Record Profile</title>
      </Head>
      {isClient && (
        <Box
          sx={{
            bgcolor: grey[100],
            width: "50%",
            mx: "auto",
            p: 4,
            borderRadius: 5,
          }}
        >
          <Typography sx={{ textAlign: "center" }} variant="h4" gutterBottom>
            Your Profile
          </Typography>
          <Box>
            <Typography
              sx={{
                mx: "auto",
                mt: 2,
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
              }}
              variant="subtitle1"
            >
              Avatar
            </Typography>
            <Avatar
              sx={{
                mx: "auto",
                mt: 1
              }}
              src={userItem.photoURL}
            />
          </Box>
          <Typography sx={{ textAlign: "center", mt: 3 }} variant="subtitle1">
            Display Name
          </Typography>
          <Typography sx={{ textAlign: "center" }} variant="h5" gutterBottom>
            {userItem.displayName}
          </Typography>
          <Typography sx={{ textAlign: "center", mt: 3 }} variant="subtitle1">
            Email Address
          </Typography>
          <Typography sx={{ textAlign: "center" }} variant="h5" gutterBottom>
            {userItem.email}
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            <Tooltip title="Edit" placement="bottom-start" arrow>
              <IconButton
                sx={{ mr: 2 }}
                color="primary"
                onClick={() => router.push("/EditProfile")}
              >
                <EditIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Back" placement="bottom-start" arrow>
              <IconButton
                sx={{ ml: 2 }}
                color="primary"
                onClick={() => router.push("/Top")}
              >
                <ReplyIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            {/* <Button variant="contained" color="error" onClick={handleAccountDelete}>
              アカウント削除
            </Button> */}
          </Box>
        </Box>
      )}
    </Layout>
  );
};

export default Profile;
