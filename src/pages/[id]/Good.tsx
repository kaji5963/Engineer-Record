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
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { cyan, red } from "@mui/material/colors";
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
  editItemState,
  goodListState,
  recordListState,
  userItemState,
} from "../../constants/atom";

const Good = () => {
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [goodList, setGoodList] = useRecoilState(goodListState);
  const [isClient, setIsClient] = useState(false);

  //firebaseのgoodsからデータを取得
  useEffect(() => {
    const goodUsersRef = query(
      collection(db, "users", userItem.uid, "goods"),
      orderBy("timeStamp", "desc")
    );
    onSnapshot(goodUsersRef, (querySnapshot) => {
      const goodsData = querySnapshot.docs.map((doc) => {
        const goodInfo = recordList.find((record) => {
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
                    bgcolor: cyan[100],
                    maxWidth: 500,
                    mb: 4,
                    borderRadius: 5,
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{ bgcolor: cyan[200], fontSize: 20 }}
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
                      bgcolor: cyan[50],
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
      )}
    </Layout>
  );
};

export default Good;
