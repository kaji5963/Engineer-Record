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
} from "@mui/material";
import { useRecoilState } from "recoil";
import {
  // bookmarkState,
  recordItemState,
  commentListState,
  recordListState,
  userItemState,
  User,
} from "../constants/atom";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { blue } from "@mui/material/colors";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { onAuthStateChanged, updateCurrentUser } from "firebase/auth";
import { useRouter } from "next/router";

const RecordList = () => {
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [recordItem, setRecordItem] = useRecoilState(recordItemState);
  // const [commentList, setCommentList] = useRecoilState(commentListState);
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // const [saved, setSaved] = useState(false);
  // const [bookmarkItem, setBookmarkItem] = useRecoilState(bookmarkState);
  const router = useRouter();

  //firebaseからデータを取得、setRecordListで更新しrecordListに格納
  useEffect(() => {
    const recordData = collection(db, "records");
    const q = query(recordData, orderBy("timeStamp", "desc"));
    onSnapshot(q, (querySnapshot) => {
      setRecordList(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          key: doc.data().key,
          value: doc.data().value,
          createdAt: doc.data().createdAt,
          displayName: doc.data().displayName,
          photoURL: doc.data().photoURL,
          saved: doc.data().saved,
        }))
      );
    });
  }, []);

  // useEffect(() => {
  //   const commentDocRef = collection(db, "records", commentItem.id, "comment");
  //   const q = query(commentDocRef, orderBy("timeStamp", "desc"));
  //   onSnapshot(
  //     q,
  //     (snapshot) =>
  //       setCommentList(
  //         snapshot.docs.map((doc) => ({
  //           ...doc.data(),
  //           id: doc.id,
  //           key: doc.data().key,
  //           value: doc.data().value,
  //           createdAt: doc.data().createdAt,
  //         }))
  //       ),
  //     (error) => {
  //       alert(error.message);
  //     }
  //   );
  // }, []);

  //現在ログインしているuserを取得しuserItemに格納
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName, photoURL } = user as User;
        setUserItem({ ...userItem, uid, displayName, photoURL });
      }
    });
  }, []);

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  //ページネーション関数結果をuseMemoでメモ化
  const paginationList = useMemo(() => {
    const startNumber = 0 + 9 * (currentPage - 1);
    const endNumber = 10 + 9 * (currentPage - 1);
    return recordList.slice(startNumber, endNumber);
  }, [currentPage, recordList]);

  //特定のコメントボタン押すと、そのデータをコメントページに渡す
  const handleComment = (key: string) => {
    const findComment = recordList.find((recordList) => recordList.key === key);
    setRecordItem({ ...recordItem, ...findComment });

    // const [{key, value, createdAt}] = recordList
    // setComment({...comment, key, value, createdAt })
    router.push("/Comment");
  };

  //ブックマークする処理
  const handleSavedBookmark = (key: string) => {
    const bookmarkRecord = recordList.map((recordList) =>
      recordList.key === key
        ? { ...recordList, saved: !recordList.saved }
        : recordList
    );
    setRecordList(bookmarkRecord);

    const findBookmarkRecord = bookmarkRecord.find(
      (recordList) => recordList.key === key
    );
    const { value, createdAt, displayName, photoURL, saved } =
      findBookmarkRecord!;
    addDoc(collection(db, "bookmark"), {
      key,
      value,
      createdAt,
      displayName,
      photoURL,
      saved,
      timeStamp: serverTimestamp(),
    });
  };

  //ブックマーク外す処理
  const handleRemoveBookmark = (key: string) => {
    const bookmarkRecord = recordList.map((recordList) =>
      recordList.key === key
        ? { ...recordList, saved: !recordList.saved }
        : recordList
    );
    setRecordList(bookmarkRecord);
  };

  //Record編集処理
  const handleEditRecord = (key: string) => {
    const findEditRecord = recordList.find(
      (recordList) => recordList.key === key
    );
    setRecordItem({ ...recordItem, ...findEditRecord });
    router.push("/EditRecord");
  };

  //Record削除処理
  const handleDeleteRecord = (id: string) => {
    const deleteMessage = confirm("削除してもよろしいですか？");
    if (deleteMessage === true) {
      deleteDoc(doc(db, "records", id));
      const deleteRecord = recordList.filter(
        (recordList) => recordList.id !== id
      );
      setRecordList(deleteRecord);
    } else {
      return;
    }
  };

  return (
    <>
      <Stack>
        <Pagination
          count={100}
          sx={{ mx: "auto", mb: 4 }}
          color="primary"
          variant="outlined"
          shape="rounded"
          page={currentPage}
          onChange={(e, currentPage: number) => setCurrentPage(currentPage)}
        />
      </Stack>

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
          {paginationList.map((record) => {
            return (
              <Box
                key={record.key}
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
                      sx={{ bgcolor: blue[200], fontSize: 20 }}
                      src={record.photoURL}
                    ></Avatar>
                  }
                  action={
                    <>
                      <Tooltip title="Edit" placement="bottom-start" arrow>
                        <IconButton
                          sx={{ mr: 2 }}
                          onClick={() => handleEditRecord(record.key)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete" placement="bottom-start" arrow>
                        <IconButton
                          sx={{ mr: 2 }}
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  }
                  title={record.displayName}
                  subheader={record.createdAt}
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
                    {record.value}
                  </Typography>
                </CardContent>

                <CardActions
                  sx={{ display: "flex", justifyContent: "space-around" }}
                  disableSpacing
                >
                  <Tooltip title="Comment" placement="right-start" arrow>
                    <IconButton onClick={() => handleComment(record.key)}>
                      <ChatBubbleOutlineIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Good" placement="right-start" arrow>
                    <IconButton>
                      <ThumbUpOffAltIcon />
                    </IconButton>
                  </Tooltip>

                  {record.saved === true ? (
                    <Tooltip title="Bookmark" placement="right-start" arrow>
                      <IconButton
                        onClick={() => handleRemoveBookmark(record.key)}
                      >
                        <BookmarkIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Bookmark" placement="right-start" arrow>
                      <IconButton
                        onClick={() => handleSavedBookmark(record.key)}
                      >
                        <BookmarkBorderIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </CardActions>
              </Box>
            );
          })}
        </Card>
      )}
    </>
  );
};

export default RecordList;
