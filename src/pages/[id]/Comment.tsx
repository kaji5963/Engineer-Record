import Head from "next/head";
import TopLayout from "../../components/Layout/TopLayout";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Tooltip,
  Grid,
  Toolbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { red } from "@mui/material/colors";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  commentItemState,
  userItemState,
  editItemState,
  userDataState,
} from "../../constants/atom";
import React,{ useEffect, useState } from "react";
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
import CommentForm from "../../components/CommentForm";

type CommentList = {
  commentId: string;
  id: string;
  postId: string;
  value: string;
  createdAt: string;
  displayName: string;
  photoURL: string;
};

export type CommentInfo = {
  docId: string;
  postId: string;
  value: string;
  createdAt: string;
};

const Comment = () => {
  const { v4: uuidv4 } = require("uuid");
  const userData = useRecoilValue(userDataState);
  const userItem = useRecoilValue(userItemState);
  const commentItem = useRecoilValue(commentItemState);
  const [commentList, setCommentList] = useState<CommentList[]>([]);
  const [editItem, setEditItem] = useRecoilState(editItemState);
  const [isClient, setIsClient] = useState(false);
  const [comment, setComment] = useState<CommentInfo>({
    docId: uuidv4(),
    postId: commentItem.postId, //投稿者のpostId
    value: "",
    createdAt: changeDateFormat(new Date()),
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
      orderBy("timeStamp", "asc")
    );
    onSnapshot(commentRef, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => {
        const commentInfo = userData.find((user) => {
          return user.uid === doc.data().commentId;
        });
        return {
          ...doc.data(),
          id: doc.id,
          commentId: doc.data().commentId,
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
    const { docId, postId, value, createdAt } = comment;
    //firebaseのサブコレクションに追加処理
    const commentDocRef = doc(db, "comments", docId);
    setDoc(commentDocRef, {
      commentId: userItem.uid,
      postId, //投稿者のpostIdとイコール関係
      value,
      createdAt,
      timeStamp: serverTimestamp(),
    });
    //comment初期化
    setComment({
      docId: uuidv4(),
      postId: commentItem.postId,
      value: "",
      createdAt: changeDateFormat(new Date()),
    });
  };

  //comment編集処理
  const handleEditComment = (postId: string, value: string) => {
    const findEditRecord = commentList.find(
      (comment) => comment.value === value
    );
    setEditItem({ ...editItem, ...findEditRecord });
    router.push(`/${postId}/EditComment`);
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
    <TopLayout>
      <Head>
        <title>Engineer Record Comment</title>
      </Head>

      {isClient && (
        <>
          <Grid container spacing={{ xs: 3 }} columns={{ xs: 8, md: 16 }}>
            <CommentForm
              commentItem={commentItem}
              comment={comment}
              setComment={setComment}
              handleCommentSubmit={handleCommentSubmit}
            />

            <Grid item xs={8}>
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
                          minWidth: 360,
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
                          action={
                            <Box sx={{ mt: 1 }}>
                              <Tooltip title="Edit" placement="top-start" arrow>
                                <span>
                                  <IconButton
                                    sx={{ mr: 2 }}
                                    onClick={() =>
                                      handleEditComment(
                                        comment.postId,
                                        comment.value
                                      )
                                    }
                                    disabled={
                                      userItem.uid === comment.commentId
                                        ? false
                                        : true
                                    }
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <Tooltip
                                title="Delete"
                                placement="top-start"
                                arrow
                              >
                                <span>
                                  <IconButton
                                    sx={{ mr: 2 }}
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    disabled={
                                      userItem.uid === comment.commentId
                                        ? false
                                        : true
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Box>
                          }
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
                        <Toolbar />
                      </Box>
                    );
                  })}
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </TopLayout>
  );
};

export default Comment;
