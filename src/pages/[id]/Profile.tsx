import Head from "next/head";
import Layout from "../../components/Layout";
import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { grey } from "@mui/material/colors";
import { useRecoilState } from "recoil";
import { User, userItemState } from "../../constants/atom";
import { useEffect, useState } from "react";
import { auth } from "../../components/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

const Profile = () => {
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  //ユーザー情報を取得
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user as User;
        setUserItem({ ...userItem, uid, email, displayName, photoURL });
      }
    });
  }, []);

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
            minWidth: 400,
            maxWidth: 600,
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
              mt: 2,
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
          <Box
            sx={{
              bgcolor: "white",
              height: 130,
              maxWidth: 240,
              mx: "auto",
              px: 0.5,
              pt: 2,
              mt: 4,
              mb: 4,
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

          <Box sx={{ textAlign: "center" }}>
            <Tooltip title="Edit" placement="top-start" arrow>
              <span>
              <IconButton
                sx={{ mr: 4 }}
                color="primary"
                onClick={() => router.push(`/${userItem.uid}/EditProfile`)}
              >
                <EditIcon fontSize="large" />
              </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Back" placement="top-start" arrow>
              <span>
              <IconButton
                color="primary"
                onClick={() => router.push("/Top")}
              >
                <ReplyIcon fontSize="large" />
              </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      )}
    </Layout>
  );
};

export default Profile;
