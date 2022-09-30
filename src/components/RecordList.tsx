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
  commentItemState,
  commentListState,
  recordListState,
  userItemState,
  editItemState,
  bookmarkItemState,
  bookmarkListState,
  UserData,
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
import CommentIcon from "@mui/icons-material/Comment";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";

const RecordList = () => {
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [commentList, setCommentList] = useRecoilState(commentListState);
  const [commentItem, setCommentItem] = useRecoilState(commentItemState);
  const [editItem, setEditItem] = useRecoilState(editItemState);
  const [bookmarkItem, setBookmarkItem] = useRecoilState(bookmarkItemState);
  const [bookmarkList, setBookmarkList] = useRecoilState(bookmarkListState);
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [bookmarkSaved, setBookmarkSaved] = useState(false);

  //firebaseからリアルタイムでデータを取得（firebaseの設定 collectionGroupをfirebase側で手動設定し降順）
  useEffect(() => {
    //recordsのデータを取得
    //bookmarksのデータを取得
    //records.postIdとbookmarks.postIdがイコールのものだけtrue/falseを反転
    //それをsetRecordListに格納する
    const recordsRef = query(
      collectionGroup(db, "records"),
      orderBy("timeStamp", "desc")
    );

    onSnapshot(recordsRef, (querySnapshot) => {
      const recordsData = querySnapshot.docs.map((doc) => ({
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
      setRecordList(recordsData);
    });

    // const usersRef = query(collection(db, "users"));
    // onSnapshot(usersRef, (querySnapshot) => {
    //   const userData = querySnapshot.docs.map((doc) => ({
    //     ...doc.data(),
    //     displayName: doc.data().displayName,
    //     photoURL: doc.data().photoURL,
    //   }));
    // });

    // setTodoList((oldTodoList: Array<TodoList>) => [
    //   ...oldTodoList,
    //   {
    //     id: Math.floor(Math.random() * 1000).toString(16),
    //     title,
    //     detail,
    //     status: 0,
    //     priority,
    //     createAt: changeDateFormat(new Date()),
    //     updateAt: changeDateFormat(new Date()),
    //     category,
    //   },
    // ]);setTodoList((oldTodoList: Array<TodoList>) => [
    //   ...oldTodoList,
    //   {
    //     id: Math.floor(Math.random() * 1000).toString(16),
    //     title,
    //     detail,
    //     status: 0,
    //     priority,
    //     createAt: changeDateFormat(new Date()),
    //     updateAt: changeDateFormat(new Date()),
    //     category,
    //   },
    // ]);






    // const bookmarkRef = query(
    //   collection(db, "users", userItem.uid, "bookmarks"),
    //   orderBy("timeStamp", "desc")
    // );
    //     onSnapshot(bookmarkRef, (querySnapshot) => {
    //       const bookmarkData = querySnapshot.docs.map((doc) => ({
    //         ...doc.data(),
    //         id: doc.id,
    //         uid: doc.data().uid,
    //         postId: doc.data().postId,
    //         value: doc.data().value,
    //         createdAt: doc.data().createdAt,
    //         displayName: doc.data().displayName,
    //         photoURL: doc.data().photoURL,
    //         saved: doc.data().saved,
    //       }));
    //       setBookmarkList(bookmarkData)
    //     });

    // onSnapshot(recordsRef, (querySnapshot) => {
    //   querySnapshot.docs.map((recordDoc) => {
    //     const recordData = recordDoc.data().postId
    //     // console.log(recordData);

    //     onSnapshot(bookmarkRef, (querySnapshot) => {
    //       querySnapshot.docs.map((bookmarkDoc) => {
    //         const bookmarkData = bookmarkDoc.data().postId
    //         // console.log(bookmarkData);
    //         const a = recordList.map((record) => {
    //           recordData === bookmarkData
    //   ? { ...recordList, saved: !record.saved }
    //   : recordList})

    //         // setRecordList(a)
    //       })
    //     })
    //   })
    // })

    // setRecordListで更新し投稿データをrecordListに格納
    // onSnapshot(recordsRef, (querySnapshot) => {
    //   const recordsData = querySnapshot.docs.map((doc) => ({
    // ...doc.data(),
    // id: doc.id,
    // uid: doc.data().uid,
    // postId: doc.data().postId,
    // value: doc.data().value,
    // createdAt: doc.data().createdAt,
    // displayName: doc.data().displayName,
    // photoURL: doc.data().photoURL,
    // saved: doc.data().saved,
    // saved: doc.data().postId === bookmarkItem.postId ? !doc.data().saved : doc.data().saved
    // saved: doc.data().postId === bookmarkItem.postId && !doc.data().saved
    // }));
    // setRecordList(recordsData);

    // onSnapshot(bookmarkRef, (querySnapshot) => {
    //   const bookmarkData = querySnapshot.docs.map((doc) => ({
    //   ...doc.data(),
    //   id: doc.id,
    //   uid: doc.data().uid,
    //   postId: doc.data().postId,
    //   value: doc.data().value,
    //   createdAt: doc.data().createdAt,
    //   displayName: doc.data().displayName,
    //   photoURL: doc.data().photoURL,
    //   saved: doc.data().saved,
    // }))
    // setBookmarkList(bookmarkData)
    // })

    // })

    // const bookmarkRef = query(
    //   collection(db, "users", userItem.uid, "bookmarks")
    // );
    // const getBookmark = await getDocs(bookmarkRef);
    // getBookmark.forEach((doc) => {
    //   if (doc.data()) {
    //     console.log(doc.id, " => ", doc.data().saved);

    //   }
    // });

    // onSnapshot(recordsRef, (querySnapshot) => {
    //   setRecordList(
    //     querySnapshot.docs.map((doc) => ({
    //       ...doc.data(),
    //       id: doc.id,
    //       uid: doc.data().uid,
    //       postId: doc.data().postId,
    //       value: doc.data().value,
    //       createdAt: doc.data().createdAt,
    //       displayName: doc.data().displayName,
    //       photoURL: doc.data().photoURL,
    //       saved: doc.data().saved,
    //     }))
    //   );
    // });
  }, []);

  //firebaseからブックマークしたデータを取得
  // useEffect(() => {
  // const bookmarkRef = query(
  //   collection(db, "users", userItem.uid, "bookmarks"),
  // );
  //   onSnapshot(bookmarkRef, (querySnapshot) => {
  //     const bookmarkData = querySnapshot.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //       uid: doc.data().uid,
  //       postId: doc.data().postId,
  //       value: doc.data().value,
  //       createdAt: doc.data().createdAt,
  //       displayName: doc.data().displayName,
  //       photoURL: doc.data().photoURL,
  //       saved: doc.data().saved,
  //     }));
  //     setBookmarkList(bookmarkData)
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
    const findComment = recordList.find((record) => record.postId === postId);
    setCommentItem({ ...commentItem, ...findComment });
    router.push(`/${id}/Comment`);
  };

  //ブックマークする処理
  const handleSavedBookmark = (postId: string) => {
    //ブックマークしたもののtrue/falseを反転
    const addBookmarkRecord = recordList.map((record) =>
      record.postId === postId ? { ...record, saved: !record.saved } : record
    );
    setRecordList(addBookmarkRecord);

    const findBookmarkRecord = addBookmarkRecord.find(
      (record) => record.postId === postId
    );

    const { uid, value, createdAt, displayName, photoURL, saved } =
      findBookmarkRecord!;
    //ブックマークしたデータをfirebaseへ格納
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
    //ブックマークしたもののtrue/falseを反転
    const removeBookmarkRecord = recordList.map((record) =>
      record.postId === postId ? { ...record, saved: !record.saved } : record
    );
    setRecordList(removeBookmarkRecord);

    //firebaseのブックマークされたデータを削除
    deleteDoc(doc(db, "users", userItem.uid, "bookmarks", postId));
  };

  //Record編集処理
  const handleEditRecord = (id: string, postId: string) => {
    const findEditRecord = recordList.find(
      (record) => record.postId === postId
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
        (record) => record.id !== id
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

                  maxWidth: 500,
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
                    <Box sx={{ mt: 1 }}>
                      <Tooltip title="Edit" placement="bottom-start" arrow>
                        <span>
                          <IconButton
                            sx={{ mr: 2 }}
                            onClick={() =>
                              handleEditRecord(record.id, record.postId)
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
                  titleTypographyProps={{ fontSize: 16 }}
                  subheaderTypographyProps={{ fontSize: 16 }}
                  title={record.displayName}
                  subheader={record.createdAt}
                />
                <CardContent
                  sx={{
                    bgcolor: blue[50],
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
                    {record.value}
                  </Typography>
                </CardContent>

                <CardActions
                  sx={{ display: "flex", justifyContent: "space-around" }}
                >
                  <Tooltip title="Comment" placement="right-start" arrow>
                    {/* <span>
                      {commentList[0] ? (
                        <IconButton
                          onClick={() =>
                            handleComment(record.id, record.postId)
                          }
                        >
                          <CommentIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() =>
                            handleComment(record.id, record.postId)
                          }
                        >
                          <ChatBubbleOutlineIcon />
                        </IconButton>
                      )}
                    </span> */}
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

                  {/* {bookmarkSaved === true ? ( */}
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
};;

export default RecordList;
