import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { db } from "../../components/firebase";
import {
  bookmarkListState,
  editItemState,
  recordListState,
  userItemState,
} from "../../constants/atom";
import {
  Box,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Stack,
  Pagination,
  Tooltip,
  Toolbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { onAuthStateChanged, updateCurrentUser } from "firebase/auth";
import { useRouter } from "next/router";
import { blue, green, orange } from "@mui/material/colors";
import Layout from "../../components/Layout";
import Head from "next/head";

const MyRecord = () => {
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [bookmarkList, setBookmarkList] = useRecoilState(bookmarkListState);
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [editItem, setEditItem] = useRecoilState(editItemState);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter()

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
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL,
        saved: doc.data().saved,
      }));
      setRecordList(myRecordData);
    });
  }, []);

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  //Record編集処理
  const handleEditMyRecord = (id: string, postId: string) => {
    const findEditRecord = recordList.find(
      (recordList) => recordList.postId === postId
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
      const deleteRecord = recordList.filter(
        (recordList) => recordList.id !== id
      );
      setRecordList(deleteRecord);
    } else {
      return;
    }
  };

  return (
    <Layout>
      <Head>
        <title>Engineer Record MyRecord</title>
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
          {recordList.map((record) => {
            if (record.postId !== record.postId) return; //条件式以外のものは表示しない
            return (
              <Box
                key={record.postId}
                sx={{
                  bgcolor: orange[100],
                  maxWidth: 500,
                  mb: 4,
                  borderRadius: 5,
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{ bgcolor: orange[200], fontSize: 20 }}
                      src={record.photoURL}
                    ></Avatar>
                  }
                  titleTypographyProps={{ fontSize: 16 }}
                  subheaderTypographyProps={{ fontSize: 16 }}
                  title={record.displayName}
                  subheader={record.createdAt}
                  action={
                    <Box sx={{mt:1}}>
                      <Tooltip title="Edit" placement="bottom-start" arrow>
                        <span>
                          <IconButton
                            sx={{ mr: 2 }}
                            onClick={() =>
                              handleEditMyRecord(record.id, record.postId)
                            }
                            disabled={
                              userItem.uid === record.uid ? false : true
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Delete" placement="bottom-start" arrow>
                        <span>
                          <IconButton
                            sx={{ mr: 2 }}
                            onClick={() => handleDeleteRecord(record.id)}
                            disabled={
                              userItem.uid === record.uid ? false : true
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
                    bgcolor: orange[50],
                  }}
                >
                  <Typography
                    sx={{ minHeight: 100, whiteSpace: "pre-line", fontSize: 18 }}
                    variant="body2"
                    color="text.secondary"
                    component="p"
                  >
                    {record.value}
                  </Typography>
                </CardContent>
                <Toolbar />
              </Box>
            );
          })}
        </Card>
      )}
    </Layout>
  );
};

export default MyRecord;
