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
  bookmarkState,
  commentItemState,
  commentListState,
  Record,
  recordListState,
  userItemState,
} from "../constants/atom";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
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
  const [commentItem, setCommentItem] = useRecoilState(commentItemState);
  // const [commentList, setCommentList] = useRecoilState(commentListState);
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [saved, setSaved] = useState(false);
  const [bookmarkList, setBookmarkList] = useRecoilState(bookmarkState);
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

  //現在ログインしているuserを取得、setUserItemで更新しuserItemに格納
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email, uid, displayName, photoURL } = user;
        setUserItem({ ...userItem, email, uid, displayName, photoURL });
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
    setCommentItem({ ...commentItem, ...findComment });

    // const [{key, value, createdAt}] = recordList
    // setComment({...comment, key, value, createdAt })
    router.push("/Comment");
  };

  //ブックマークする処理    一旦保留
  const handleSavedBookmark = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    key: string,
    saved: boolean
  ) => {
    // const bookmarkRecord = recordList.find((recordList) => recordList.key === key)
    // console.log(!bookmarkRecord?.saved);
    // const {id, key, value, createdAt, displayName, photoURL, saved} = bookmarkRecord
    // setBookmarkList({...bookmarkList, id, key, value, createdAt, displayName, photoURL, saved });
    // console.log(bookmarkList);
    setSaved(true);
  };

  //ブックマーク外す処理
  const handleRemoveBookmark = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    setSaved(false);
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
                      // src={record.photoURL}
                      alt=""
                    ></Avatar>
                  }
                  action={
                    <>
                      <Tooltip title="Edit" placement="bottom-start" arrow>
                        <IconButton sx={{ mr: 2 }}>
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

                  {saved === true ? (
                    <Tooltip title="Bookmark" placement="right-start" arrow>
                      <IconButton onClick={(e) => handleRemoveBookmark(e)}>
                        <BookmarkIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Bookmark" placement="right-start" arrow>
                      <IconButton
                        onClick={(e) =>
                          handleSavedBookmark(e, record.key, record.saved)
                        }
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
