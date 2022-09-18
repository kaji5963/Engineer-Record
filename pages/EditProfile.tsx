import {
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import Head from "next/head";
import Layout from "./components/Layout";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { userItemState } from "./constants/atom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { FormEvent } from "react";
import { onAuthStateChanged, updateProfile, User } from "firebase/auth";
import { auth } from "./components/firebase";

const EditProfile = () => {
  const [userItem, setUserItem] = useRecoilState(userItemState);

  const router = useRouter();

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
    displayName: string | null,
    photoURL: string | null
  ) => {
    e.preventDefault();

    updateProfile(auth.currentUser as User, {
      displayName,
      photoURL,
    });
    setUserItem({ ...userItem, displayName, photoURL });
    router.push("/Top");
  };

  return (
    <Layout>
      <Head>
        <title>Engineer Record EditProfile</title>
      </Head>
      <form
        onSubmit={(e) =>
          handleSubmit(e, userItem.displayName, userItem.photoURL)
        }
      >
        <Box
          sx={{
            bgcolor: grey[100],
            width: "50%",
            mx: "auto",
            p: 4,
            borderRadius: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ textAlign: "center" }} variant="h4" gutterBottom>
            Edit Profile
          </Typography>
          <Stack
            sx={{
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">Avatar</Typography>

            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                // onChange={(e) =>
                //   setUserItem({ ...userItem, photoURL: e.target.files![0] })
                // }
              />
              <AccountCircleIcon
                sx={{
                  cursor: "pointer",
                }}
                fontSize="large"
              />
            </IconButton>
          </Stack>

          <Box sx={{ mx: "auto" }}>
            <Typography sx={{ textAlign: "center", mb: 1 }} variant="subtitle1">
              Display Name
            </Typography>

            <TextField
              sx={{ textAlign: "center", mb: 3 }}
              id="filled-hidden-label-small"
              value={userItem.displayName}
              size="medium"
              onChange={(e) =>
                setUserItem({ ...userItem, displayName: e.target.value })
              }
            />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Tooltip title="Complete" placement="bottom-start" arrow>
              <IconButton
                sx={{ mr: 3 }}
                color="primary"
                type="submit"
                onClick={() => router.push("/Top")}
              >
                <CheckCircleIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Back" placement="bottom-start" arrow>
              <IconButton
                sx={{ ml: 3 }}
                color="primary"
                onClick={() => router.push("/Profile")}
              >
                <ReplyIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </form>
    </Layout>
  );
};

export default EditProfile;
