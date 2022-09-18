import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { grey } from "@mui/material/colors";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "./components/Layout";
import { useRecoilState } from "recoil";
import { userItemState } from "./constants/atom";
import { useEffect, useState } from "react";

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
            <IconButton
              sx={{
                bgcolor: grey[200],
                mx: "auto",
                mb: 2,
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <label>
                <PersonAddIcon
                  sx={{
                    cursor: "pointer",
                  }}
                  fontSize="large"
                />
                <input type="file" style={{ display: "none" }} />
              </label>
            </IconButton>
          </Box>

          <Typography sx={{ textAlign: "center" }} variant="h5" gutterBottom>
            {`Display Name : ${userItem.displayName}`}
          </Typography>
          <Typography sx={{ textAlign: "center" }} variant="h5" gutterBottom>
            {`Email Address : ${userItem.email}`}
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
          </Box>
        </Box>
      )}
    </Layout>
  );
};

export default Profile;
