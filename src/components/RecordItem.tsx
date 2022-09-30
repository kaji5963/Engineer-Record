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
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { blue } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { query, collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { RecordList, UserData } from "../constants/atom";

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

  //ブックマークする処理
  const savePost = (recordData: RecordList) => {
    const { id, uid, postId, value, createdAt, displayName, photoURL, saved } =
      recordData;
    setSaved(true);
    const savedPosts = {
      id,
      uid,
      postId,
      value,
      createdAt,
      displayName,
      photoURL,
      saved,
    };
    // RecordListのhandleSavedBookmark関数へsavedPostsを渡して実行
    handleSavedBookmark(savedPosts);
  };
  //ブックマークを外す処理
  const removeBookmark = async (postId: string) => {
    setSaved(false);
    // RecordListにpostIdを渡して実行
    handleRemoveBookmark(postId);
  };

  //firebaseからbookmarksのデータを取得(savedを監視)
  useEffect(() => {
    const bookmarkRef = query(
      collection(db, "users", userItem.uid, "bookmarks")
    );
    onSnapshot(bookmarkRef, (querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        const postId = doc.data().postId;
        //bookmarksに格納されているpostIdとRecordListから渡されたrecordのpostIdを比較
        //上記がtrueであればsetSavedを反転しブックマークをチェック状態
        if (postId === record.postId) {
          setSaved(true);
        }
      });
    });
  }, [saved]);

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

        <Tooltip title="Good" placement="right-start" arrow>
          <IconButton>
            <ThumbUpOffAltIcon />
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
