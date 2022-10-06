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
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { orange, red } from "@mui/material/colors";
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
  goodListState,
  userDataState,
  userItemState,
} from "../../constants/atom";

const Good = () => {
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [userData, setUserData] = useRecoilState(userDataState);
  const [goodList, setGoodList] = useRecoilState(goodListState);
  const [isClient, setIsClient] = useState(false);

  //firebaseのgoodsからデータを取得
  useEffect(() => {
    const goodUsersRef = query(
      collection(db, "users", userItem.uid, "goods"),
      orderBy("timeStamp", "desc")
    );
    if (!userData) return;
    onSnapshot(goodUsersRef, (querySnapshot) => {
      const goodsData = querySnapshot.docs.map((doc) => {
        const goodInfo = userData.find((record) => {
          return record.uid === doc.data().uid;
        });
        return {
          ...doc.data(),
          id: doc.id,
          uid: doc.data().uid,
          postId: doc.data().postId,
          value: doc.data().value,
          createdAt: doc.data().createdAt,
          displayName: goodInfo!.displayName,
          photoURL: goodInfo!.photoURL,
          goodCount: doc.data().goodCount,
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
  const handleRemoveGoods = (postId: string) => {
    deleteDoc(doc(db, "users", userItem.uid, "goods", postId));
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
                          {good.goodCount > 0 ? (
                            <Tooltip
                              title="Bookmark"
                              placement="right-start"
                              arrow
                            >
                              <IconButton
                                sx={{ color: red[300] }}
                                onClick={() => handleRemoveGoods(good.postId)}
                              >
                                <ThumbUpAltIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip
                              title="Bookmark"
                              placement="right-start"
                              arrow
                            >
                              <IconButton>
                                <ThumbUpOffAltIcon />
                              </IconButton>
                            </Tooltip>
                          )}
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
