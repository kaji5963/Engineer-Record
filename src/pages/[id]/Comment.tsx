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
  Tooltip,
  Toolbar,
} from "@mui/material";
import { blue, red } from "@mui/material/colors";
import Head from "next/head";
import ReplyIcon from "@mui/icons-material/Reply";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CommentIcon from "@mui/icons-material/Comment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import NavigationIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { useRecoilState } from "recoil";
import {
  commentItemState,
  recordListState,
  userItemState,
  commentListState,
  CommentList,
  editItemState,
} from "../../constants/atom";
import { useEffect, useState } from "react";
import { changeDateFormat } from "../../components/Form";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../components/firebase";

const Comment = () => {
  const { v4: uuidv4 } = require("uuid");
  // const [recordList, setRecordList] = useRecoilState(recordListState);
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [commentItem, setCommentItem] = useRecoilState(commentItemState);
  const [commentList, setCommentList] = useRecoilState(commentListState);
  const [editItem, setEditItem] = useRecoilState(editItemState);
  const [isClient, setIsClient] = useState(false);
  const [comment, setComment] = useState({
    postId: commentItem.postId,
    commentId: uuidv4(),
    value: "",
    createdAt: changeDateFormat(new Date()),
    displayName: userItem.displayName,
    photoURL: userItem.photoURL,
  });
  const router = useRouter();

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  //commentListの取得、commentListの更新処理
  useEffect(() => {
    const commentRef = query(
      collection(db, "comments"),
      where("postId", "==", commentItem.postId),
      orderBy("timeStamp", "desc")
    );
    onSnapshot(
      commentRef,
      (snapshot) =>
        setCommentList(
          snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            uid: doc.data().uid,
            postId: doc.data().postId,
            commentId: doc.data().commentId,
            value: doc.data().value,
            createdAt: doc.data().createdAt,
            displayName: doc.data().displayName,
            photoURL: doc.data().photoURL,
          }))
        ),
      (error) => {
        alert(error.message);
      }
    );
  }, []);

  //comment送信処理
  const handleCommentSubmit = () => {
    if (comment.value === "") return;
    const { postId, commentId, value, createdAt, displayName, photoURL } =
      comment;
    //firebaseのサブコレクションに追加処理
    const commentDocRef = collection(db, "comments");
    setDoc(doc(commentDocRef), {
      uid: userItem.uid,
      postId, //投稿者のpostIdとイコール関係
      commentId,
      value,
      createdAt,
      displayName,
      photoURL,
      timeStamp: serverTimestamp(),
    });
    //comment初期化
    setComment({
      postId: commentItem.postId,
      commentId: uuidv4(),
      value: "",
      createdAt: changeDateFormat(new Date()),
      displayName: userItem.displayName,
      photoURL: userItem.photoURL,
    });
  };

  //comment編集処理
  const handleEditRecord = (id: string, postId: string) => {
    const findEditRecord = commentList.find(
      (commentList) => commentList.postId === postId
    );
    setEditItem({ ...editItem, ...findEditRecord });
    router.push(`/${id}/EditComment`);
  };

  //comment削除処理
  const handleDeleteComment = (id: string) => {
    const deleteMessage = confirm("削除してもよろしいですか？");
    if (deleteMessage === true) {
      deleteDoc(doc(db, "comments", id));
      const deleteRecord = commentList.filter(
        (commentList) => commentList.id !== id
      );
      setCommentList(deleteRecord);
    } else {
      return;
    }
  };

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
              mb: 3,
              borderRadius: 5,
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: blue[200] }}
                  src={commentItem.photoURL}
                ></Avatar>
              }
              titleTypographyProps={{ fontSize: 16 }}
              subheaderTypographyProps={{ fontSize: 16 }}
              title={commentItem.displayName}
              subheader={commentItem.createdAt}
            />
            <CardContent
              sx={{
                bgcolor: blue[50],
              }}
            >
              <Typography
                sx={{ minHeight: 100, whiteSpace: "pre-line", fontSize: 18 }}
                variant="body2"
                color="text.secondary"
                component="p"
              >
                {commentItem.value}
              </Typography>
            </CardContent>
            <Toolbar />
          </Box>
        </Card>
      )}
      {/* --------------------------------------- */}
      <Box
        sx={{
          mt: 2,
          mb: 2,
          display: "flex",
          justifyContent: "center",
          mx: "auto",
        }}
      >
        <TextField
          sx={{ width: "500px" }}
          label="New Comment"
          value={comment.value}
          autoFocus
          onChange={(e) => setComment({ ...comment, value: e.target.value })}
        />
      </Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "center",
          mx: "auto",
        }}
      >
        <Fab variant="extended" onClick={handleCommentSubmit}>
          <NavigationIcon />
          Comment
        </Fab>
      </Box>

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
          {commentList.map((comment) => {
            if (comment.postId !== commentItem.postId) return; //条件式以外のものは表示しない
            return (
              <Box
                key={comment.commentId}
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
                      sx={{ ml: 2, bgcolor: red[200] }}
                      src={comment.photoURL}
                    ></Avatar>
                  }
                  titleTypographyProps={{ fontSize: 16 }}
                  subheaderTypographyProps={{ fontSize: 16 }}
                  title={comment.displayName}
                  subheader={comment.createdAt}
                />
                <CardContent
                  sx={{
                    bgcolor: red[50],
                  }}
                >
                  <Typography
                    sx={{
                      minHeight: 50,
                      whiteSpace: "pre-line",
                      fontSize: 16,
                    }}
                    variant="body2"
                    color="text.secondary"
                    component="p"
                  >
                    {comment.value}
                  </Typography>
                </CardContent>

                <CardActions
                  sx={{ display: "flex", justifyContent: "space-around" }}
                >
                  <Tooltip title="Edit" placement="right-start" arrow>
                    <span>
                      <IconButton
                        onClick={() =>
                          handleEditRecord(comment.id, comment.postId)
                        }
                        disabled={userItem.uid === comment.uid ? false : true}
                      >
                        <EditIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Delete" placement="right-start" arrow>
                    <span>
                      <IconButton
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={userItem.uid === comment.uid ? false : true}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </CardActions>
              </Box>
            );
          })}
        </Card>
      )}
    </Layout>
  );
};


export default Comment;
