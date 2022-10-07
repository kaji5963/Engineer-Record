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
} from "firebase/firestore";
import { db } from "./firebase";
import { RecordList, recordListState, User } from "../constants/atom";
import { useRecoilState } from "recoil";
import { NextRouter } from "next/router";

type Props = {
  record: RecordList;
  handleComment: (id: string, postId: string) => void;
  handleEditRecord: (id: string, postId: string) => void;
  handleDeleteRecord: (id: string) => void;
  handleSavedBookmark: (postData: RecordList) => void;
  handleRemoveBookmark: (postId: string) => void;
  userItem: User;
  router: NextRouter;
};

type Good = {
  id: string;
  uid: string;
  postId: any;
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
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [goodUsers, setGoodUsers] = useState<Good[]>([]);

  //投稿に対してgoodしたユーザーを取得、取得したデータ（数）をlengthで表示
  useEffect(() => {
    const goodUsersRef = query(
      collectionGroup(db, "goodUsers"),
      where("postId", "==", record.postId)
    );
    onSnapshot(goodUsersRef, (querySnapshot) => {
      const goodUserData = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
          uid: doc.data().uid,
          postId: doc.data().postId,
        };
      });
      setGoodUsers(goodUserData);
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
    const { uid, postId, value, createdAt, displayName, photoURL } = record;
    const goodPostDoc = doc(db, "users", userItem.uid, "goodPosts", postId);
    const goodUserDoc = doc(
      db,
      "users",
      userItem.uid,
      "records",
      postId,
      "goodUsers",
      postId
    );

    if (goodUsers.length === 0) {
      //goodが0の場合（good+1）
      await setDoc(goodPostDoc, {
        uid,
        postId,
        value,
        createdAt,
        displayName,
        photoURL,
        key: uuidv4(),
        timeStamp: serverTimestamp(),
      });

      await setDoc(goodUserDoc, {
        postId,
        uid: userItem.uid,
        timeStamp: serverTimestamp(),
      });
    } else {
      //goodが1以上の場合
      goodUsers.forEach(async (good) => {
        if (userItem.uid !== good.uid) {
          //goodしているのがログインユーザー以外だったら追加（good+1）
          await setDoc(goodPostDoc, {
            uid,
            postId,
            value,
            createdAt,
            displayName,
            photoURL,
            key: uuidv4(),
            timeStamp: serverTimestamp(),
          });
          await setDoc(goodUserDoc, {
            postId,
            uid: userItem.uid,
            timeStamp: serverTimestamp(),
          });
          console.log(1);
          
        } else {
          //goodしているのがログインユーザーだったら削除（good-1）
          await deleteDoc(
            doc(
              db,
              "users",
              userItem.uid,
              "records",
              postId,
              "goodUsers",
              postId
            )
          );
          await deleteDoc(doc(db, "users", userItem.uid, "goodPosts", postId));
          console.log(2);

        }
      });
    }
  };

  //ブックマーク追加処理
  const savePost = (recordData: RecordList) => {
    const {
      id,
      uid,
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
      uid,
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
                  disabled={userItem.uid === record.uid ? false : true}
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Delete" placement="top-start" arrow>
              <span>
                <IconButton
                  sx={{ mr: 2 }}
                  onClick={() => handleDeleteRecord(record.id)}
                  disabled={userItem.uid === record.uid ? false : true}
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

      <CardActions sx={{ display: "flex", justifyContent: "space-around" }}>
        <Tooltip title="Comment" placement="right-start" arrow>
          <IconButton onClick={() => handleComment(record.id, record.postId)}>
            <ChatBubbleOutlineIcon />
          </IconButton>
        </Tooltip>

        {/* {goodUsers.length > 0 ? (
          <Tooltip title="Good" placement="right-start" arrow>
            <IconButton
              sx={{ color: red[300] }}
              onClick={() => handleGoodCount(record)}
            >
              <ThumbUpAltIcon />
              <span style={{ marginLeft: 5, fontSize: 18 }}>
                {goodUsers.length}
              </span>
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Good" placement="right-start" arrow>
            <IconButton onClick={() => handleGoodCount(record)}>
              <ThumbUpOffAltIcon />

              <span style={{ marginLeft: 5, fontSize: 18 }}>
                {goodUsers.length}
              </span>
            </IconButton>
          </Tooltip>
        )} */}


        {goodUsers.length === 0 ? (
          <Tooltip title="Good" placement="right-start" arrow>
            <IconButton onClick={() => handleGoodCount(record)}>
              <ThumbUpOffAltIcon />

              <span style={{ marginLeft: 5, fontSize: 18 }}>
                {goodUsers.length}
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
                {goodUsers.length}
              </span>
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Good List" placement="right-start" arrow>
          <IconButton onClick={() => router.push(`/${record.id}/GoodList`)}>
            <ListAltIcon />
          </IconButton>
        </Tooltip>

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
