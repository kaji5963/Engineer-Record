import {
  Avatar,
  Box,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChatIcon from '@mui/icons-material/Chat';
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { blue, red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import {
  query,
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  collectionGroup,
  serverTimestamp,
  where,
  writeBatch,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { RecordList, User } from "../constants/atom";
import { NextRouter } from "next/router";

type Props = {
  record: RecordList;
  handleComment: (id: string, postId: string) => void;
  handleEditRecord: (id: string, postId: string) => void;
  handleDeleteRecord: (id: string, authorId: string, commentExist: CommentData[]) => void;
  handleSavedBookmark: (postData: RecordList) => void;
  handleRemoveBookmark: (postId: string) => void;
  userItem: User;
  router: NextRouter;
};

type GoodUser = {
  id: string;
  goodUserId: string;
  postId: string;
};

export type CommentData = {
  id: string;
  commentId: string;
  postId: string;
};

export const RecordItem = ({
  record,
  handleComment,
  handleEditRecord,
  handleDeleteRecord,
  handleRemoveBookmark,
  handleSavedBookmark,
  userItem,
  router,
}: Props) => {
  const { v4: uuidv4 } = require("uuid");
  const [saved, setSaved] = useState(false);
  const [goodUsers, setGoodUsers] = useState<GoodUser[]>([]);
  const [commentExist, setCommentExist] = useState<CommentData[]>([]);

  useEffect(() => {
    //投稿に対してgoodしたユーザーを取得、取得したデータ（数）をlengthで表示
    const goodUsersRef = query(
      collectionGroup(db, "goodUsers"),
      where("postId", "==", record.postId)
    );
    onSnapshot(goodUsersRef, (querySnapshot) => {
      const goodUserData = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
          goodUserId: doc.data().goodUserId,
          postId: doc.data().postId,
        };
      });
      setGoodUsers(goodUserData);
    });

  //commentアイコンの表示切り替え用として取得
    const commentsRef = query(
      collection(db, "comments"),
      where("postId", "==", record.postId)
    );
    onSnapshot(commentsRef, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
          commentId: doc.data().commentId,
          postId: doc.data().postId,
        };
      });
      setCommentExist(commentsData);
    });
  }, []);

  //firebaseからbookmarksのデータを取得(savedを監視)
  useEffect(() => {
    const bookmarksRef = query(
      collection(db, "users", userItem.uid, "bookmarks")
    );
    onSnapshot(bookmarksRef, (querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        const postId = doc.data().postId;
        //bookmarksに格納されているpostIdとRecordListから渡されたrecordのpostIdを比較
        //上記がtrueのものだけsavedを反転しブックマークをチェック状態
        if (postId === record.postId) {
          setSaved(true);
        }
      });
    });
  }, [saved]);

  //good（いいね）のカウントを増減処理
  const handleGoodCount = async (record: RecordList) => {
    const {
      authorId,
      postId,
      value,
      createdAt,
      displayName,
      photoURL,
      goodCount,
    } = record;
    const goodPostDoc = doc(db, "users", userItem.uid, "goodPosts", authorId);
    const goodUserDoc = doc(
      db,
      "users",
      userItem.uid,
      "records",
      postId,
      "goodUsers",
      postId
    );

    setDoc(goodPostDoc, {
      goodPostId: authorId,
      postId,
      value,
      createdAt,
      displayName,
      photoURL,
      key: uuidv4(), //GoodListページのmap用key
      timeStamp: serverTimestamp(),
    });

    setDoc(goodUserDoc, {
      goodUserId: userItem.uid,
      postId,
      timeStamp: serverTimestamp(),
    });

    const batch = writeBatch(db);
    const recordsRef = doc(db, "users", userItem.uid, "records", postId);
    batch.update(recordsRef, { goodCount: increment(1) });
    batch.commit();
    // console.log(recordsRef);

    // if (goodUsers.length === 0) {
    //   setDoc(goodPostDoc, {
    //     goodPostId: authorId,
    //     postId,
    //     value,
    //     createdAt,
    //     displayName,
    //     photoURL,
    //     key: uuidv4(), //GoodListページのmap用key
    //     timeStamp: serverTimestamp(),
    //   });

    //   await setDoc(goodUserDoc, {
    //     goodUserId: userItem.uid,
    //     postId,
    //     timeStamp: serverTimestamp(),
    //   });
    // } else {
    //   goodUsers.forEach((good) => {
    //     if (good.goodUserId === userItem.uid) {
    //         setUserExist(true);
    //     } else setUserExist(false);
    //   });
    // }
    // if (userExist) {
    //   await deleteDoc(doc(db, "users", userItem.uid, "goodPosts", authorId));
    //   await deleteDoc(
    //     doc(db, "users", userItem.uid, "records", postId, "goodUsers", postId)
    //   );
    // } else {
    //   setDoc(goodPostDoc, {
    //     goodPostId: authorId,
    //     postId,
    //     value,
    //     createdAt,
    //     displayName,
    //     photoURL,
    //     key: uuidv4(), //GoodListページのmap用key
    //     timeStamp: serverTimestamp(),
    //   });

    //   await setDoc(goodUserDoc, {
    //     goodUserId: userItem.uid,
    //     postId,
    //     timeStamp: serverTimestamp(),
    //   });
    // }

    // if (goodUsers.length === 0) {
    //   //goodが0の場合（good+1）
    //   await setDoc(goodPostDoc, {
    //     goodPostId: authorId,
    //     postId,
    //     value,
    //     createdAt,
    //     displayName,
    //     photoURL,
    //     key: uuidv4(), //GoodListページのmap用key
    //     timeStamp: serverTimestamp(),
    //   });

    //   await setDoc(goodUserDoc, {
    //     goodUserId: userItem.uid,
    //     postId,
    //     timeStamp: serverTimestamp(),
    //   });
    // } else {
    //   //goodが1以上の場合
    //   goodUsers.forEach(async (good) => {
    //     if (userItem.uid !== good.goodUserId) {
    //       //goodしているのがログインユーザー以外だったら追加（good+1）
    //       await setDoc(goodPostDoc, {
    //         goodPostId: authorId,
    //         postId,
    //         value,
    //         createdAt,
    //         displayName,
    //         photoURL,
    //         key: uuidv4(),
    //         timeStamp: serverTimestamp(),
    //       });
    //       await setDoc(goodUserDoc, {
    //         goodUserId: userItem.uid,
    //         postId,
    //         timeStamp: serverTimestamp(),
    //       });
    //       console.log("追加");
    //       // console.log(good);

    //     } else {
    //       //goodしているのがログインユーザーだったら削除（good-1）
    //       await deleteDoc(
    //         doc(db, "users", userItem.uid, "goodPosts", authorId)
    //       );
    //       await deleteDoc(
    //         doc(
    //           db,
    //           "users",
    //           userItem.uid,
    //           "records",
    //           postId,
    //           "goodUsers",
    //           postId
    //         )
    //       );
    //       console.log("削除");
    //       // console.log(good);

    //     }
    //   });
    // }
  };

  //ブックマーク追加処理
  const savePost = (recordData: RecordList) => {
    const {
      id,
      authorId,
      postId,
      value,
      createdAt,
      displayName,
      photoURL,
      goodCount,
    } = recordData;
    setSaved(true);
    const savedPosts = {
      id,
      authorId,
      postId,
      value,
      createdAt,
      displayName,
      photoURL,
      goodCount,
      saved: true, //クライアント側のbookmarkページのチェック状態を維持
    };
    // RecordListのhandleSavedBookmark関数へsavedPostsを渡して実行
    handleSavedBookmark(savedPosts);
  };
  //ブックマーク削除処理
  const removeBookmark = async (postId: string) => {
    setSaved(false);
    // RecordListにpostIdを渡して実行
    handleRemoveBookmark(postId);
  };

  return (
    //以下をRecordListでmap展開
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
            <Tooltip title="Edit" placement="top-start" arrow>
              <span>
                <IconButton
                  sx={{ mr: 2 }}
                  onClick={() => handleEditRecord(record.id, record.postId)}
                  disabled={userItem.uid === record.authorId ? false : true}
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Delete" placement="top-start" arrow>
              <span>
                <IconButton
                  sx={{ mr: 2 }}
                  onClick={() => handleDeleteRecord(record.id, record.authorId, commentExist)}
                  disabled={userItem.uid === record.authorId ? false : true}
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
      {/* commentアイコンの条件分岐（commntExist.lengthで表示） */}
      <CardActions sx={{ display: "flex", justifyContent: "space-around" }}>
        {commentExist.length === 0 ? (
          <Tooltip title="Comment" placement="right-start" arrow>
            <IconButton onClick={() => handleComment(record.id, record.postId)}>
              <ChatBubbleOutlineIcon />
              <span style={{ marginLeft: 5, fontSize: 18 }}>
                {commentExist.length}
              </span>
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Comment" placement="right-start" arrow>
            <IconButton onClick={() => handleComment(record.id, record.postId)}>
              <ChatIcon />
              <span style={{ marginLeft: 5, fontSize: 18 }}>
                {commentExist.length}
              </span>
            </IconButton>
          </Tooltip>
        )}
      {/* goodアイコンの条件分岐（record.goodCountで表示） */}
        {record.goodCount === 0 ? (
          <Tooltip title="Good" placement="right-start" arrow>
            <IconButton onClick={() => handleGoodCount(record)}>
              <ThumbUpOffAltIcon />

              <span style={{ marginLeft: 5, fontSize: 18 }}>
                {record.goodCount}
              </span>
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Good" placement="right-start" arrow>
            <IconButton
              sx={{ color: red[300] }}
              onClick={() => handleGoodCount(record)}
            >
              <ThumbUpAltIcon />
              <span style={{ marginLeft: 5, fontSize: 18 }}>
                {record.goodCount}
              </span>
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Good List" placement="right-start" arrow>
          <IconButton onClick={() => router.push(`/${record.id}/GoodList`)}>
            <ListAltIcon />
          </IconButton>
        </Tooltip>
      {/* bookmarkアイコンの条件分岐（savedのtrue/falseで表示） */}
        {saved ? (
          <Tooltip title="Bookmark" placement="right-start" arrow>
            <IconButton onClick={() => removeBookmark(record.postId)}>
              <BookmarkIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Bookmark" placement="right-start" arrow>
            <IconButton onClick={() => savePost(record)}>
              <BookmarkBorderIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Box>
  );
};
