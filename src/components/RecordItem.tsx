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
  updateDoc,
  setDoc,
  deleteDoc,
  collectionGroup,
  serverTimestamp,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  goodDataListState,
  goodListState,
  RecordList,
  recordListState,
  User,
} from "../constants/atom";
import { useRecoilState } from "recoil";
import { NextRouter, Router } from "next/router";

type Props = {
  record: RecordList;
  handleComment: (id: string, postId: string) => void;
  handleEditRecord: (id: string, postId: string) => void;
  handleDeleteRecord: (id: string) => void;
  handleSavedBookmark: (postData: RecordList) => void;
  handleRemoveBookmark: (postId: string) => void;
  userItem: User;
  router: NextRouter
};

type Good = {
  id: string;
  postId: any;
}

export const RecordItem = ({
  record,
  handleComment,
  handleEditRecord,
  handleDeleteRecord,
  handleRemoveBookmark,
  handleSavedBookmark,
  userItem,
  router
}: Props) => {
  const { v4: uuidv4 } = require("uuid");
  const [saved, setSaved] = useState(false);
  const [goodCount, setGoodCount] = useState(0);
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [goodList, setGoodList] = useRecoilState(goodListState);
  const [goodUsers, setGoodUsers] = useState<Good[]>([]);
  // const [goodData, setGoodData] = useState<string[]>([]);

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
          postId: doc.data().postId,
        };
      });
      setGoodUsers(goodUserData);
    });

    //firebaseからgoodsのデータを取得
    // useEffect(() => {
    //   const goodsRef = query(collection(db, "users", userItem.uid, "goods"));
    //   onSnapshot(goodsRef, (querySnapshot) => {
    //     querySnapshot.docs.forEach((doc) => {
    //       const postId = doc.data().postId;
    //       //goodsに格納されているpostIdとRecordListから渡されたrecordのpostIdを比較
    //       //上記がtrueのものだけgoodCount+1をしてgoodをチェック状態
    //       if (postId === record.postId) {
    //         setGoodCount(goodCount + 1);
    //       }
    //     });
    //   });
  }, []);
  // console.log(goodUsers);

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

  //good（いいね）のカウントを+1及び-1
  const handleGoodCount = async (record: RecordList) => {
    const { uid, postId, value, createdAt, displayName, photoURL } = record;
    //firebase(users サブコレクションにgoodsとして格納)
    const goodPostDoc = doc(db, "users", userItem.uid, "goodPosts", postId);
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

    const goodUserDoc = doc(
      db,
      "users",
      userItem.uid,
      "records",
      postId,
      "goodUsers",
      postId
    );
    await setDoc(goodUserDoc, {
      postId,
      timeStamp: serverTimestamp(),
    });

    // await deleteDoc(doc(db, "users", userItem.uid, "records", postId, "goodUsers", postId));
    // await deleteDoc(doc(db, "users", userItem.uid, "goodPosts", postId));

    // if (goodData.length === 0) {
    //   const goodUserUpRef = doc(db, "goodUsers", postId);
    //   // goodData.push(userItem.uid)
    //   // console.log(data);
    //   goodData.push(uid);
    //   setDoc(
    //     goodUserUpRef,
    //     {
    //       goodData,
    //       goodCount: goodData.length,
    //       uid, //投稿者のpostIdとイコール関係
    //     },
    //     { merge: true }
    //   );
    // } else {
    //   let goodExistence = false;
    //   let goodIndex = 0;
    //   if (goodData) {
    //     goodData.forEach((good, index) => {
    //       if (userItem.uid === uid) {
    //         goodExistence = true;
    //         goodIndex = index;
    //       }
    //     });
    //   }
    //   console.log(goodExistence);

    //   if (goodExistence) {
    //     goodData.splice(goodIndex, 1);
    //   } else {
    //     goodData.push(uid);
    //   }
    //   setDoc(
    //     doc(db, "goodUsers", postId),
    //     {
    //       goodData,
    //       goodCount: goodData.length,
    //     },
    //     { merge: true }
    //   );
    // }
    // console.log(goodData);
    // const goodUserDownRef = doc(db, "goodUsers", postId);
    // const dd = data.splice(0, 1)
    // console.log(dd);
    // updateDoc(goodUserDownRef, {
    //   goodCount: good + 1,
    //   postId, //投稿者のpostIdとイコール関係
    // });
    // if (good === 0) {
    //   //firebase(users サブコレクションにgoodsとして格納)
    //   const goodUpDoc = doc(db, "users", userItem.uid, "goods", postId);
    //   await setDoc(goodUpDoc, {
    //     uid,
    //     postId,
    //     value,
    //     createdAt,
    //     goodCount: good + 1,
    //     timeStamp: serverTimestamp(),
    //   });
    //   setGoodCount(good + 1);
    // } else {
    //   await deleteDoc(doc(db, "users", userItem.uid, "goods", postId));
    //   setGoodCount(good - 1);
    // }
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
      // goodCount,
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

        {goodUsers.length > 0 ? (
          <Tooltip title="Good" placement="right-start" arrow>
            <IconButton
              sx={{ color: red[300] }}
              onClick={() => handleGoodCount(record)}
            >
              <ThumbUpAltIcon />
              <span style={{ marginLeft: 5, fontSize: 18 }}>
                {" "}
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
