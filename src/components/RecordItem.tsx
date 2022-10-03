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
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
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
} from "firebase/firestore";
import { db } from "./firebase";
import {
  goodListState,
  RecordList,
  recordListState,
  UserData,
} from "../constants/atom";
import { useRecoilState } from "recoil";

type Props = {
  record: RecordList;
  handleComment: (id: string, postId: string) => void;
  handleEditRecord: (id: string, postId: string) => void;
  handleDeleteRecord: (id: string) => void;
  handleSavedBookmark: (postData: RecordList) => void;
  handleRemoveBookmark: (postId: string) => void;
  userItem: UserData;
};

export const RecordItem = ({
  record,
  handleComment,
  handleEditRecord,
  handleDeleteRecord,
  handleRemoveBookmark,
  handleSavedBookmark,
  userItem,
}: Props) => {
  const [saved, setSaved] = useState(false);
  const [goodCount, setGoodCount] = useState(0);
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [goodList, setGoodList] = useRecoilState(goodListState);

  // useEffect(() => {
  //   const goodsRef = query(collection(db, "goods"));
  //   onSnapshot(goodsRef, (querySnapshot) => {
  // //     const goodsData = querySnapshot.docs.map((doc) => ({
  // //       ...doc.data(),
  // //       id: doc.id,
  // //       uid: doc.data().uid,
  // //       postId: doc.data().postId,
  // //       value: doc.data().value,
  // //       createdAt: doc.data().createdAt,
  // //       displayName: doc.data().displayName,
  // //       photoURL: doc.data().photoURL,
  // //       goodCount: doc.data().goodCount,
  // //     }));
  // //     setRecordList(goodsData);
  //   });
  // }, []);

  //firebaseからbookmarksのデータを取得(savedを監視)
  useEffect(() => {
    const bookmarkRef = query(
      collection(db, "users", userItem.uid, "bookmarks")
    );
    onSnapshot(bookmarkRef, (querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        const postId = doc.data().postId;
        //bookmarksに格納されているpostIdとRecordListから渡されたrecordのpostIdを比較
        //上記がtrueのものだけsetSavedを反転しブックマークをチェック状態
        if (postId === record.postId) {
          setSaved(true);
        }
      });
    });
  }, [saved]);

  //good（いいね）のカウントを+1及び-1
  const handleGoodCount = async (good: number, record: RecordList) => {
    const { uid, postId, value, createdAt, displayName, photoURL } = record
    if (good === 0) {
      // const goodUpDoc = collectionGroup(db, "records");
      // const goodUpDoc = doc(db, "users", userItem.uid, "records", record.id);
      // await updateDoc(goodUpDoc, {
      //   goodCount: good + 1,
      // });
      const goodUpDoc = doc(db, "goods", postId);
      await setDoc((goodUpDoc), {
        uid,
        postId,
        value,
        createdAt,
        displayName,
        photoURL,
        goodCount: good + 1,
      });
      setGoodCount(good + 1);
    } else {
      const goodDownDoc = doc(db, "goods", postId);
      // const goodDownDoc = doc(db, "users", userItem.uid, "records", record.id);
      await updateDoc(goodDownDoc, {
        goodCount: good - 1,
      });
      // await deleteDoc(doc(db, "goods", postId));
      setGoodCount(good - 1);
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
      saved: true, //クライアント側のbookmarkページの状態を維持
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
            <Tooltip title="Edit" placement="bottom-start" arrow>
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
            <Tooltip title="Delete" placement="bottom-start" arrow>
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

        {goodCount > 0 ? (
          <Tooltip title="Good" placement="right-start" arrow>
            <IconButton
              sx={{ color: red[300] }}
              onClick={() => handleGoodCount(goodCount, record)}
            >
              <ThumbUpAltIcon />

              <span style={{ marginLeft: 5, fontSize: 18 }}> {goodCount}</span>
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Good" placement="right-start" arrow>
            <IconButton onClick={() => handleGoodCount(goodCount, record)}>
              <ThumbUpOffAltIcon />

              <span style={{ marginLeft: 5, fontSize: 18 }}>{goodCount}</span>
            </IconButton>
          </Tooltip>
        )}

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
