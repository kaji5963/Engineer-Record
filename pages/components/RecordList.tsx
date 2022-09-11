import {
  Box,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  CardActions,
  IconButton,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { useRecoilState } from "recoil";
import { recordListState } from "../constants/atom";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const RecordList = () => {
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [isClient, setIsClient] = useState(false);

  //firebaseからデータを取得しsetTaskで更新しtaskに格納(taskを監視)
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
          userName: doc.userName,
          userImage: doc.userImage,
          ...doc.data(),
        }))
      );
    });
  }, []);

  //Hydrate Error対策
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        // <Box sx={{ display: "flex", mt: 4, }}
        // justifyContent="center"
        // component="form">
        //   <List
        //     sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        //   >
        //     {recordList.map((record) => (
        //       <ListItem
        //       sx={{mt: 4, mb:6}}
        //         key={record.key}
        //         disableGutters
        //         secondaryAction={
        //           <IconButton aria-label="comment">
        //             <CommentIcon />
        //           </IconButton>
        //         }
        //       >
        //         <ListItemText primary={record.value} />
        //       </ListItem>
        //     ))}
        //   </List>
        //   </Box>

        <Card
          sx={{
            maxWidth: 500,
            display: "flex",
            flexDirection: "column",
            mx: "auto",
          }}
        >
          {recordList.map((record) => {
            return (
              <Box
                key={record.key}
                sx={{
                  bgcolor: red[100],
                  minHeight: 200,
                  width: 500,
                  mb: 4,
                  borderRadius: 5,
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{ bgcolor: red[200] }}
                      aria-label="recipe"
                    ></Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title="kaji"
                  subheader={record.createdAt}
                />
                <CardContent
                  sx={{
                    bgcolor: red[50],
                  }}
                >
                  <Typography
                    sx={{ height: 100 }}
                    variant="body2"
                    color="text.secondary"
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
                    <FavoriteIcon />
                  </IconButton>

                  <IconButton aria-label="share">
                    <ShareIcon />
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
