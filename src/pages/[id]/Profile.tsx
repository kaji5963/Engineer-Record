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
import Layout from "../../components/Layout";
import { useRecoilState } from "recoil";
import { userItemState } from "../../constants/atom";
import { useEffect, useState } from "react";
import { auth } from "../../components/firebase";

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
            bgcolor: grey[300],
            maxWidth: "60%",
            minWidth: "40%",
            mx: "auto",
            p: 5,
            borderRadius: 5,
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              maxWidth: 240,
              minWidth: 200,
              mx: "auto",
              height: 100,
              p: 0.5,
              pt: 3.5,
              borderRadius: 5,
            }}
          >
            <Typography
              sx={{
                mx: "auto",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                fontWeight: "bold",
              }}
              variant="subtitle1"
            >
              Avatar
            </Typography>
            <Avatar
              sx={{
                mx: "auto",
                mt: 1,
              }}
              src={userItem.photoURL}
            />
          </Box>
          <Box
            sx={{
              bgcolor: "white",
              height: 120,
              maxWidth: 240,
              mx: "auto",
              px: 0.5,
              pt: 1,
              mt: 4,
              borderRadius: 5,
            }}
          >
            <Typography
              sx={{ textAlign: "center", mt: 3, fontWeight: "bold" }}
              variant="subtitle1"
            >
              Display Name
            </Typography>
            <Typography
              sx={{ textAlign: "center", pt: 1 }}
              variant="h6"
              gutterBottom
            >
              {userItem.displayName}
            </Typography>
          </Box>
          {/* <Typography sx={{ textAlign: "center", mt: 3 }} variant="subtitle1">
            User ID
          </Typography>
          <Typography
            sx={{ textAlign: "center", fontSize: 14 }}
            variant="subtitle1"
            gutterBottom
          >
            {userItem.uid}
          </Typography> */}
          <Box
            sx={{
              bgcolor: "white",
              height: 130,
              maxWidth: 240,
              mx: "auto",
              px: 0.5,
              pt: 2,
              mt: 4,
              borderRadius: 5,
            }}
          >
            <Typography
              sx={{ textAlign: "center", mt: 3, fontWeight: "bold" }}
              variant="subtitle1"
            >
              Email Address
            </Typography>
            <Typography sx={{ textAlign: "center" }} variant="h6" gutterBottom>
              {userItem.email}
            </Typography>
          </Box>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Tooltip title="Edit" placement="bottom-start" arrow>
              <IconButton
                sx={{ mr: 4 }}
                color="primary"
                onClick={() => router.push(`/${userItem.uid}/EditProfile`)}
              >
                <EditIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Back" placement="bottom-start" arrow>
              <IconButton
                sx={{ ml: 4 }}
                color="primary"
                onClick={() => router.push("/Top")}
              >
                <ReplyIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}
    </Layout>
  );
};

export default Profile;
