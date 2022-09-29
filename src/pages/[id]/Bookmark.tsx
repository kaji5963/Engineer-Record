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
import {
  bookmarkListState,
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
import { blue, green } from "@mui/material/colors";
import Layout from "../../components/Layout";
import Head from "next/head";

const Bookmark = () => {
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [bookmarkList, setBookmarkList] = useRecoilState(bookmarkListState);
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [isClient, setIsClient] = useState(false);

  console.log(bookmarkList);

  useEffect(() => {
    const bookmarkRef = query(
      collection(db, "users", userItem.uid, "bookmarks"),
      orderBy("timeStamp", "desc")
    );
    onSnapshot(bookmarkRef, (querySnapshot) => {
      const bookmarkData = querySnapshot.docs.map((doc) => ({
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
      setBookmarkList(bookmarkData);
    });
  }, []);

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  //ブックマーク外す処理
  const handleRemoveBookmark = (postId: string) => {
    //ブックマークしたもののtrue/falseを反転
    const removeBookmarkRecord = bookmarkList.map((bookmarkList) =>
      bookmarkList.postId === postId
        ? { ...bookmarkList, saved: !bookmarkList.saved }
        : bookmarkList
    );
    setRecordList(removeBookmarkRecord);

    //firebaseのブックマークされたデータを削除
    deleteDoc(doc(db, "users", userItem.uid, "bookmarks", postId));
  };

  return (
    <Layout>
      <Head>
        <title>Engineer Record Bookmark</title>
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
          {bookmarkList.map((bookmark) => {
            return (
              <Box
                key={bookmark.postId}
                sx={{
                  bgcolor: green[100],

                  width: 500,
                  mb: 4,
                  borderRadius: 5,
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{ bgcolor: green[200], fontSize: 20 }}
                      src={bookmark.photoURL}
                    ></Avatar>
                  }
                  action={
                    <Box sx={{ mr: 3, mt: 1 }}>
                      {bookmark.saved === true ? (
                        <Tooltip title="Bookmark" placement="right-start" arrow>
                          <IconButton
                            onClick={() =>
                              handleRemoveBookmark(bookmark.postId)
                            }
                          >
                            <BookmarkIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Bookmark" placement="right-start" arrow>
                          <IconButton>
                            <BookmarkBorderIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  }
                  title={bookmark.displayName}
                  subheader={bookmark.createdAt}
                />
                <CardContent
                  sx={{
                    bgcolor: green[50],
                  }}
                >
                  <Typography
                    sx={{ minHeight: 100, whiteSpace: "pre-line" }}
                    variant="body2"
                    color="text.secondary"
                    component="p"
                  >
                    {bookmark.value}
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

export default Bookmark;
