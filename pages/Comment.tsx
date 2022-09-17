import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fab,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { blue, red } from "@mui/material/colors";
import Head from "next/head";
import CommentIcon from "@mui/icons-material/Comment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import StarIcon from "@mui/icons-material/Star";
import NavigationIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";
import Layout from "./components/Layout";
import { useRecoilState } from "recoil";
import {
  commentItemState,
  recordListState,
  userItemState,
} from "./constants/atom";
import { useEffect, useState } from "react";

const Comment = () => {
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [comment, setComment] = useRecoilState(commentItemState);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  return (
    <Layout>
      <Head>
        <title>Engineer Record Comment</title>
      </Head>
      {isClient && (
        <Card
          sx={{
            maxWidth: 500,
            display: "flex",
            flexDirection: "column",
            mx: "auto",
            boxShadow: 0,
          }}
        >
          <Box
            sx={{
              bgcolor: blue[100],

              width: 500,
              mb: 4,
              borderRadius: 5,
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: blue[200] }}
                  aria-label="recipe"
                  // src={comment.photoURL}
                  alt=""
                ></Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={userItem.displayName}
              subheader={comment.createdAt}
            />
            <CardContent
              sx={{
                bgcolor: blue[50],
              }}
            >
              <Typography
                sx={{ minHeight: 100, whiteSpace: "pre-line" }}
                variant="body2"
                color="text.secondary"
                component="p"
              >
                {comment.value}
              </Typography>
            </CardContent>

            <CardActions
              sx={{ display: "flex", justifyContent: "space-around" }}
              disableSpacing
            >
              <IconButton aria-label="comment" disabled>
                <CommentIcon />
              </IconButton>

              <IconButton aria-label="add to favorites">
                <ThumbUpIcon />
              </IconButton>

              <IconButton aria-label="share">
                <StarIcon />
              </IconButton>
            </CardActions>
          </Box>
        </Card>
      )}

      {/* --------------------------------------- */}

      <Button
        sx={{ mb: 6, display: "flex", mx: "auto" }}
        onClick={() => router.back()}
      >
        戻る
      </Button>
      <Box
        sx={{
          mt: 2,
          mb: 2,
          display: "flex",
          justifyContent: "center",
          mx: "auto",
        }}
      >
        <TextField sx={{ width: "500px" }} label="New Comment" />
      </Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "center",
          mx: "auto",
        }}
      >
        <Fab variant="extended">
          <NavigationIcon />
          Comment
        </Fab>
      </Box>

      {/* <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography sx={{ mr: 10 }} variant="h5">
          text
        </Typography>
        <Typography variant="h6">text</Typography>
      </Box> */}

      <Card
        sx={{
          maxWidth: 500,
          display: "flex",
          flexDirection: "column",
          mx: "auto",
          boxShadow: 0,
        }}
      >
        <Box
          sx={{
            bgcolor: red[100],

            width: 500,
            mb: 4,
            borderRadius: 5,
          }}
        >
          <CardHeader
            avatar={
              <Avatar
                sx={{ bgcolor: red[200] }}
                aria-label="recipe"
                // src={comment.photoURL}
                alt=""
              ></Avatar>
            }
            // title={userItem.displayName}
            // subheader={comment.createdAt}
          />
          <CardContent
            sx={{
              bgcolor: red[50],
            }}
          >
            <Typography
              sx={{ minHeight: 80, whiteSpace: "pre-line" }}
              variant="body2"
              color="text.secondary"
              component="p"
            >
              {/* {comment.value} */}
            </Typography>
          </CardContent>

          <CardActions
            sx={{ display: "flex", justifyContent: "space-around" }}
            disableSpacing
          >
            <IconButton>
              <EditIcon />
            </IconButton>

            <IconButton>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Box>
      </Card>
    </Layout>
  );
};

export default Comment;
