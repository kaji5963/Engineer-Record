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
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { green } from "@mui/material/colors";
import { useRecoilState } from "recoil";
import {
  bookmarkListState,
  recordListState,
  userDataState,
  userItemState,
} from "../../constants/atom";
import { useEffect, useState } from "react";
import { db } from "../../components/firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

const Bookmark = () => {
  const [bookmarkList, setBookmarkList] = useRecoilState(bookmarkListState);
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [userData, setUserData] = useRecoilState(userDataState);
  const [isClient, setIsClient] = useState(false);

  //firebaseのbookmarksからデータ取得
  useEffect(() => {
    const bookmarkRef = query(
      collection(db, "users", userItem.uid, "bookmarks"),
      orderBy("timeStamp", "desc")
    );
    if (userData.length === 0) return;
    onSnapshot(bookmarkRef, (querySnapshot) => {
      const bookmarksData = querySnapshot.docs.map((doc) => {
        const bookmarkInfo = userData.find((record) => {
          return record.uid === doc.data().uid;
        });
        return {
          ...doc.data(),
          id: doc.id,
          uid: doc.data().uid,
          postId: doc.data().postId,
          value: doc.data().value,
          createdAt: doc.data().createdAt,
          displayName: bookmarkInfo!.displayName,
          photoURL: bookmarkInfo!.photoURL,
          saved: doc.data().saved,
        };
      });
      setBookmarkList(bookmarksData);
    });
  }, []);

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  //ブックマーク外す処理（firebaseのブックマークされたデータを削除）
  const handleRemoveBookmark = (postId: string) => {
    deleteDoc(doc(db, "users", userItem.uid, "bookmarks", postId));
  };

  return (
    <Layout>
      <Head>
        <title>Engineer Record Bookmark</title>
      </Head>

      {isClient && (
        <>
          {bookmarkList.length === 0 && (
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
              Bookmarkした投稿がありません
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
            {bookmarkList.length > 0 &&
              bookmarkList.map((bookmark) => {
                return (
                  <Box
                    key={bookmark.postId}
                    sx={{
                      bgcolor: green[100],
                      maxWidth: 500,
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
                          <Tooltip title="Bookmark" placement="top-start" arrow>
                            <span>
                              <IconButton
                                onClick={() =>
                                  handleRemoveBookmark(bookmark.postId)
                                }
                              >
                                <BookmarkIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      }
                      titleTypographyProps={{ fontSize: 16 }}
                      subheaderTypographyProps={{ fontSize: 16 }}
                      title={bookmark.displayName}
                      subheader={bookmark.createdAt}
                    />
                    <CardContent
                      sx={{
                        bgcolor: green[50],
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
                        {bookmark.value}
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

export default Bookmark;
