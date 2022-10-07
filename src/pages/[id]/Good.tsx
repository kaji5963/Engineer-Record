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
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { orange, red } from "@mui/material/colors";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React,{ useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { db } from "../../components/firebase";
import {
  recordListState,
  userDataState,
  userItemState,
} from "../../constants/atom";

type GoodList = {
  goodPostId: string;
  id: string;
  postId: string;
  value: string;
  createdAt: string;
  displayName: string ;
  photoURL: string;
  key: string
};

const Good = () => {
  const recordList = useRecoilValue(recordListState);
  const userItem = useRecoilValue(userItemState);
  const userData = useRecoilValue(userDataState);
  const [goodList, setGoodList] = useState<GoodList[]>([]);
  const [isClient, setIsClient] = useState(false);


  //firebaseのgoodPostsからデータを取得
  useEffect(() => {
    const goodUsersRef = query(
      collection(db, "users", userItem.uid, "goodPosts"),
      orderBy("timeStamp", "desc")
    );
    if (userData.length === 0) return;
    onSnapshot(goodUsersRef, (querySnapshot) => {
      const goodsData = querySnapshot.docs.map((doc) => {
        const goodInfo = userData.find((user) => {
          return user.uid === doc.data().goodPostId;
        });
        return {
          ...doc.data(),
          id: doc.id,
          goodPostId: doc.data().goodPostId,
          postId: doc.data().postId,
          value: doc.data().value,
          createdAt: doc.data().createdAt,
          displayName: goodInfo!.displayName,
          photoURL: goodInfo!.photoURL,
          key: doc.data().key,
        };
      });
      setGoodList(goodsData);
    });
  }, []);

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  //good削除処理
  const handleRemoveGoods = (goodPostId: string) => {
    deleteDoc(doc(db, "users", userItem.uid, "goodPosts", goodPostId));
    recordList.forEach((record) => {
      deleteDoc(
        doc(db, "users", userItem.uid, "records", record.postId, "goodUsers", record.postId)
      );
    })
  };

  return (
    <Layout>
      <Head>
        <title>Engineer Record Good</title>
      </Head>

      {isClient && (
        <>
          {goodList.length === 0 && (
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
              Goodした投稿がありません
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
            {goodList &&
              goodList.map((good) => {
                return (
                  <Box
                    key={good.postId}
                    sx={{
                      bgcolor: orange[100],
                      maxWidth: 500,
                      mb: 4,
                      borderRadius: 5,
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{ bgcolor: orange[200], fontSize: 20 }}
                          src={good.photoURL}
                        ></Avatar>
                      }
                      titleTypographyProps={{ fontSize: 16 }}
                      subheaderTypographyProps={{ fontSize: 16 }}
                      title={good.displayName}
                      subheader={good.createdAt}
                      action={
                        <Box sx={{ mr: 3, mt: 1 }}>
                          <Tooltip title="Good" placement="top-start" arrow>
                            <span>
                              <IconButton
                                sx={{ color: red[300] }}
                                onClick={() =>
                                  handleRemoveGoods(good.goodPostId)
                                }
                              >
                                <ThumbUpAltIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      }
                    />
                    <CardContent
                      sx={{
                        bgcolor: orange[50],
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
                        {good.value}
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

export default Good;
