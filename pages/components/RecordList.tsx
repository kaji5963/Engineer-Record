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
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { useRecoilState } from "recoil";
import { recordListState, userItemState } from "../constants/atom";
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "./firebase";
import { blue } from "@mui/material/colors";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import StarIcon from "@mui/icons-material/Star";
import { onAuthStateChanged } from "firebase/auth";

const RecordList = () => {
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  //firebaseからデータを取得、setRecordListで更新しrecordListに格納
  useEffect(() => {
    const recordData = collection(db, "records");
    const q = query(recordData, orderBy("timeStamp", "desc"));
    onSnapshot(q, (querySnapshot) => {
      setRecordList(
        querySnapshot.docs.map((doc: any) => ({
          id: doc.id,
          key: doc.key,
          value: doc.value,
          createdAt: doc.createdAt,
          displayName: doc.displayName,
          photoURL: doc.photoURL,
          ...doc.data(),
        }))
      );
    });
  }, []);

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
    if (typeof window !== 'undefined') setIsClient(true);
  }, []);

  //ページネーション関数結果をuseMemoでメモ化
  const paginationList = useMemo(() => {
    const startNumber = 0 + 9 * (currentPage - 1);
    const endNumber = 10 + 9 * (currentPage - 1);
    return recordList.slice(startNumber, endNumber);
  }, [currentPage, recordList]);

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
                      sx={{ bgcolor: blue[200] }}
                      aria-label="recipe"
                      // src={record.photoURL}
                      alt=""
                    ></Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
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
                    sx={{ minHeight: 120, whiteSpace: "pre-line" }}
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
                  <IconButton aria-label="comment">
                    <CommentIcon />
                  </IconButton>

                  <IconButton aria-label="add to favorites">
                    <ThumbUpIcon />
                  </IconButton>

                  <IconButton aria-label="share">
                    <StarIcon />
                  </IconButton>
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
