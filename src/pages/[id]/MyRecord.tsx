import Head from "next/head";
import TopLayout from "../../components/Layout/TopLayout";
import {
  Box,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Toolbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deepPurple } from "@mui/material/colors";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { db } from "../../components/firebase";
import { editItemState, RecordList, userItemState } from "../../constants/atom";
import { useRouter } from "next/router";

const MyRecord = () => {
  const [myRecordList, setMyRecordList] = useState<RecordList[]>([]);
  const userItem = useRecoilValue(userItemState);
  const [commentExist, setCommentExist] = useState<{ id: string, postId: string }[]>([])
  const [editItem, setEditItem] = useRecoilState(editItemState);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  //firebaseのrecordsからデータを取得（ログインしているユーザーのみ）
  useEffect(() => {
    const myRecordsRef = query(
      collection(db, "users", userItem.uid, "records"),
      orderBy("timeStamp", "desc")
    );
    onSnapshot(myRecordsRef, (querySnapshot) => {
      const myRecordData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        authorId: doc.data().authorId,
        postId: doc.data().postId,
        value: doc.data().value,
        createdAt: doc.data().createdAt,
        goodCount: doc.data().goodCount,
        displayName: userItem.displayName,
        photoURL: userItem.photoURL,
      }));
      setMyRecordList(myRecordData);
    });
  }, []);

  //学習記録削除時、紐づいているcomment削除のため取得
  useEffect(() => {
    const commentsRef = query(
      collection(db, "comments"),
    );
    onSnapshot(commentsRef, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
          postId: doc.data().postId,
        };
      });
      setCommentExist(commentsData);
    });
  }, []);

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  //Record編集処理
  const handleEditMyRecord = (id: string, postId: string) => {
    const findEditRecord = myRecordList.find(
      (myRecord) => myRecord.postId === postId
    );
    setEditItem({ ...editItem, ...findEditRecord });
    router.push(`/${id}/EditRecord/`);
  };

  //Record削除処理
  const handleDeleteRecord = (postId: string) => {
    const deleteMessage = confirm(
      `${userItem.displayName}の学習記録を削除してもよろしいですか？`
    );
    //recordsに紐づくcomments,bookmarks,goodPosts,goodUsersをバッチ処理
    if (deleteMessage === true) {
      const batch = writeBatch(db);
      batch.delete(doc(db, "users", userItem.uid, "records", postId));
      batch.delete(doc(db, "users", userItem.uid, "goodPosts", postId));
      batch.delete(doc(db, "users", userItem.uid, "bookmarks", postId));
      batch.delete(
        doc(db, "users", userItem.uid, "goodUsers", postId)
      );
      commentExist.forEach((comment) => {
        if(comment.postId !== postId) return
        batch.delete(doc(db, "comments", comment.id));
      })
      batch.commit();
    } else return;
  };

  return (
    <TopLayout>
      <Head>
        <title>Engineer Record MyRecord</title>
      </Head>
      {isClient && (
        <>
          {myRecordList.length === 0 && (
            <Alert
              sx={{
                maxWidth: 350,
                height: 60,
                mx: "auto",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 18,
                borderRadius: 5,
              }}
              severity="info"
            >
              学習記録がありません
            </Alert>
          )}
          <Card
            sx={{
              maxWidth: 500,
              display: "flex",
              flexDirection: "column",
              mx: "auto",
              boxShadow: 0,
            }}
          >
            {myRecordList &&
              myRecordList.map((myRecord) => {
                return (
                  <Box
                    key={myRecord.postId}
                    sx={{
                      bgcolor: deepPurple[100],
                      maxWidth: 500,
                      minWidth: 360,
                      mb: 4,
                      borderRadius: 5,
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{ bgcolor: deepPurple[200], fontSize: 20 }}
                          src={myRecord.photoURL}
                        ></Avatar>
                      }
                      titleTypographyProps={{ fontSize: 16 }}
                      subheaderTypographyProps={{ fontSize: 16 }}
                      title={myRecord.displayName}
                      subheader={myRecord.createdAt}
                      action={
                        <Box sx={{ mt: 1 }}>
                          <Tooltip title="Edit" placement="top-start" arrow>
                            <span>
                              <IconButton
                                sx={{ mr: 2 }}
                                onClick={() =>
                                  handleEditMyRecord(
                                    myRecord.id,
                                    myRecord.postId
                                  )
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Delete" placement="top-start" arrow>
                            <span>
                              <IconButton
                                sx={{ mr: 2 }}
                                onClick={() => handleDeleteRecord(myRecord.postId)}
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
                        bgcolor: deepPurple[50],
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
                        {myRecord.value}
                      </Typography>
                    </CardContent>
                    <Toolbar />
                  </Box>
                );
              })}
          </Card>
        </>
      )}
    </TopLayout>
  );
};

export default MyRecord;
