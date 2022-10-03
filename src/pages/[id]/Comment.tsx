import {
  Avatar,
  Box,
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
import NavigationIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { useRecoilState } from "recoil";
import {
  commentItemState,
  userItemState,
  commentListState,
  editItemState,
  recordListState,
} from "../../constants/atom";
import { useEffect, useState } from "react";
import { changeDateFormat } from "../../components/Form";
import {
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
import { db } from "../../components/firebase";

const Comment = () => {
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [commentItem, setCommentItem] = useRecoilState(commentItemState);
  const [commentList, setCommentList] = useRecoilState(commentListState);
  const [editItem, setEditItem] = useRecoilState(editItemState);
  const [isClient, setIsClient] = useState(false);
  const [comment, setComment] = useState({
    postId: commentItem.postId, //投稿者のpostId
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

  //firebaseのcommentsからデータ取得、setCommentListで更新処理
  useEffect(() => {
    const commentRef = query(
      collection(db, "comments"),
      where("postId", "==", commentItem.postId),
      orderBy("timeStamp", "desc")
    );
    onSnapshot(commentRef, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => {
        const commentInfo = recordList.find((record) => {
          return record.uid === doc.data().uid;
        });
        return {
          ...doc.data(),
          id: doc.id,
          uid: doc.data().uid,
          postId: doc.data().postId,
          value: doc.data().value,
          createdAt: doc.data().createdAt,
          displayName: commentInfo!.displayName,
          photoURL: commentInfo!.photoURL,
        };
      });
      setCommentList(commentsData);
    });
  }, []);

  //comment送信処理
  const handleCommentSubmit = () => {
    if (comment.value === "") return;
    const { postId, value, createdAt } = comment;
    //firebaseのサブコレクションに追加処理
    const commentDocRef = doc(db, "comments", postId);
    setDoc((commentDocRef), {
      uid: userItem.uid,
      postId, //投稿者のpostIdとイコール関係
      value,
      createdAt,
      timeStamp: serverTimestamp(),
    });
    //comment初期化
    setComment({
      postId: commentItem.postId,
      value: "",
      createdAt: changeDateFormat(new Date()),
      displayName: userItem.displayName,
      photoURL: userItem.photoURL,
    });
  };

  //comment編集処理
  const handleEditRecord = (id: string, postId: string) => {
    const findEditRecord = commentList.find(
      (comment) => comment.postId === postId
    );
    setEditItem({ ...editItem, ...findEditRecord });
    router.push(`/${id}/EditComment`);
  };

  //comment削除処理
  const handleDeleteComment = (id: string) => {
    const deleteMessage = confirm(
      `${userItem.displayName}のコメントを削除してもよろしいですか？`
    );
    if (deleteMessage === true) {
      deleteDoc(doc(db, "comments", id));
    } else return;
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

              maxWidth: 500,
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
          {commentList &&
            commentList.map((comment) => {
              return (
                <Box
                  key={comment.id}
                  sx={{
                    bgcolor: red[100],
                    maxWidth: 500,
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
                        minHeight: 100,
                        whiteSpace: "pre-line",
                        fontSize: 18,
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
