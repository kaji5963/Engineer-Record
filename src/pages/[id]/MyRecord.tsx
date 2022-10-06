import Head from "next/head";
import Layout from "../../components/Layout";
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
  AlertTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deepPurple } from "@mui/material/colors";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { db } from "../../components/firebase";
import { editItemState, RecordList, userItemState } from "../../constants/atom";
import { useRouter } from "next/router";

const MyRecord = () => {
  const [myRecordList, setMyRecordList] = useState<RecordList[]>([]);
  const [userItem, setUserItem] = useRecoilState(userItemState);
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
        uid: doc.data().uid,
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
  const handleDeleteRecord = (id: string) => {
    const deleteMessage = confirm(
      `${userItem.displayName}の学習記録を削除してもよろしいですか？`
    );
    if (deleteMessage === true) {
      deleteDoc(doc(db, "users", userItem.uid, "records", id));
      deleteDoc(doc(db, "users", userItem.uid,"goods", id));
      deleteDoc(doc(db, "users", userItem.uid, "bookmarks", id));
      deleteDoc(doc(db, "comments", id));
    } else return;
  };

  return (
    <Layout>
      <Head>
        <title>Engineer Record MyRecord</title>
      </Head>

      {isClient && (
        <>
          {myRecordList.length === 0 && (
            <Alert
              sx={{
                maxWidth: 300,
                height: 60,
                mx: "auto",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 18,
              }}
              severity="info"
            >
              Recordの投稿がありません
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
                                onClick={() => handleDeleteRecord(myRecord.id)}
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
    </Layout>
  );
};

export default MyRecord;
