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
  commentItemState,
  commentListState,
  recordListState,
  userItemState,
  User,
  editItemState,
} from "../constants/atom";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  serverTimestamp,
  setDoc,
  where,
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
  const [editItem, setEditItem] = useRecoilState(editItemState);
  // const [commentList, setCommentList] = useRecoilState(commentListState);
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // const [saved, setSaved] = useState(false);
  // const [bookmarkList, setBookmarkList] = useState<{ id: string }[]>([]);
  const router = useRouter();

  //firebaseからリアルタイムでデータを取得（firebaseの設定 collectionGroupを手動設定し降順）
  useEffect(() => {
    const recordsRef = query(
      collectionGroup(db, "records"),
      orderBy("timeStamp", "desc")
    );
    onSnapshot(recordsRef, (querySnapshot) => {
      // setRecordListで更新し投稿データをrecordListに格納
      setRecordList(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          uid: doc.data().uid,
          postId: doc.data().postId,
          value: doc.data().value,
          createdAt: doc.data().createdAt,
          displayName: doc.data().displayName,
          photoURL: doc.data().photoURL,
          saved: doc.data().saved,
        }))
      );
    });
  }, []);

  //firebaseからブックマークしたデータを取得
  // useEffect(() => {
  //   const bookmarksRef = query(
  //     collection(db, "users", userItem.uid, "bookmarks"),
  //   );
  //   onSnapshot(bookmarksRef, (querySnapshot) => {
  //     console.log(querySnapshot.docs.map((doc) => doc.data()));

      // setBookmarkList(
      //   querySnapshot.docs.map((doc) => ({
      //     ...doc.data(),
      //     id: doc.id,
      //     saved: doc.data().saved,
      //   }))
      // );
  //   });
  // }, []);

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
  const handleComment = (id: string, postId: string) => {
    const findComment = recordList.find((recordList) => recordList.postId === postId);
    setCommentItem({ ...commentItem, ...findComment });
    // router.push("/Comment");
    router.push(`/Comments/${id}`);
    
  };

  //ブックマークする処理
  const handleSavedBookmark = (postId: string) => {
    const bookmarkRecord = recordList.map((recordList) =>
      recordList.postId === postId
        ? { ...recordList, saved: !recordList.saved }
        : recordList
    );
    setRecordList(bookmarkRecord);

    const findBookmarkRecord = bookmarkRecord.find(
      (recordList) => recordList.postId === postId
    );
    const { uid, value, createdAt, displayName, photoURL, saved } =
      findBookmarkRecord!;
    const bookmarksRef = doc(db, "users", userItem.uid, "bookmarks", postId);
    setDoc(bookmarksRef, {
      uid,
      postId,
      value,
      createdAt,
      displayName,
      photoURL,
      saved,
      timeStamp: serverTimestamp(),
    });
  };

  //ブックマーク外す処理
  const handleRemoveBookmark = (postId: string) => {
    const bookmarkRecord = recordList.map((recordList) =>
      recordList.postId === postId
        ? { ...recordList, saved: !recordList.saved }
        : recordList
    );
    setRecordList(bookmarkRecord);
    deleteDoc(doc(db, "users", userItem.uid, "bookmarks", postId));
  };

  //Record編集処理
  const handleEditRecord = (postId: string) => {
    const findEditRecord = recordList.find(
      (recordList) => recordList.postId === postId
    );
    setEditItem({ ...editItem, ...findEditRecord });
    router.push("/EditRecord");
  };

  //Record削除処理
  const handleDeleteRecord = (id: string) => {
    const deleteMessage = confirm("削除してもよろしいですか？");
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
                key={record.postId}
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
                          onClick={() => handleEditRecord(record.postId)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete" placement="bottom-start" arrow>
                        <span>
                          <IconButton
                            sx={{ mr: 2 }}
                            onClick={() => handleDeleteRecord(record.id)}
                            disabled={false}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
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
                    <IconButton
                      onClick={() => handleComment(record.id, record.postId)}
                    >
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
                        onClick={() => handleRemoveBookmark(record.postId)}
                      >
                        <BookmarkIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Bookmark" placement="right-start" arrow>
                      <IconButton
                        onClick={() => handleSavedBookmark(record.postId)}
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
