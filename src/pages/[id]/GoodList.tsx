import Head from "next/head";
import TopLayout from "../../components/Layout/TopLayout";
import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { Alert, Box } from "@mui/material";
import {
  collectionGroup,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../components/firebase";
import { useRecoilValue } from "recoil";
import { userDataState } from "../../constants/atom";
import { useRouter } from "next/router";
import { grey } from "@mui/material/colors";

type GoodUser = {
  id: string;
  goodUserId: string;
  key: string;
  postId: string;
  createdAt: string;
  displayName: string;
  photoURL: string;
};

const GoodList = () => {
  const userData = useRecoilValue(userDataState);
  const [goodList, setGoodList] = useState<GoodUser[]>([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  //goodUsersからgoodListのデータ取得
  useEffect(() => {
    if (!router.query.record) return;
    const goodPostsRef = query(
      collectionGroup(db, "goodUsers"),
      orderBy("timeStamp", "desc"),
      where("postId", "==", router.query.record)
    );
    if (userData.length === 0) return;
    onSnapshot(goodPostsRef, (querySnapshot) => {
      const goodPostsData = querySnapshot.docs.map((doc) => {
        const userInfo = userData.find((user) => {
          return user.uid === doc.data().goodUserId;
        });
        return {
          ...doc.data(),
          id: doc.id,
          key: doc.data().key,
          goodUserId: doc.data().goodUserId,
          postId: doc.data().postId,
          createdAt: doc.data().createdAt,
          displayName: userInfo!.displayName,
          photoURL: userInfo!.photoURL,
        };
      });
      setGoodList(goodPostsData);
    });
  }, [router.query.record]);

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  return (
    <TopLayout>
      <Head>
        <title>Engineer Record GoodList</title>
      </Head>
      {isClient && (
        <>
          {goodList.length === 0 && (
            <Alert
              sx={{
                maxWidth: 350,
                height: 60,
                mx: "auto",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 18,
                borderRadius: 5,
              }}
              severity="info"
            >
              Goodしたユーザーがいません
            </Alert>
          )}

          {goodList.length > 0 && (
            <List
              sx={{
                mx: "auto",
                textAlign: "center",
                borderRadius: 5,
                minWidth: 350,
                maxWidth: 500,
                pt: 6,
                pb: 3,
                bgcolor: grey[200],
              }}
            >
              {goodList.map((good) => {
                return (
                  <Box
                    key={good.key}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ListItem
                      sx={{
                        borderRadius: 5,
                        mb: 3,
                        minWidth: 280,
                        maxWidth: 340,
                        px: 7,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: "white",
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={good.photoURL} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={good.displayName}
                        secondary={good.createdAt}
                        primaryTypographyProps={{
                          fontWeight: "medium",
                          variant: "subtitle1",
                        }}
                        secondaryTypographyProps={{
                          fontWeight: "medium",
                          variant: "subtitle2",
                        }}
                      />
                    </ListItem>
                  </Box>
                );
              })}
            </List>
          )}
        </>
      )}
    </TopLayout>
  );
};
export default GoodList;
