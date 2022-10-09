import Head from "next/head";
import Layout from "../../components/Layout";
import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { Alert } from "@mui/material";
import {
  collectionGroup,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../components/firebase";
import { useRecoilValue } from "recoil";
import { recordListState, userDataState } from "../../constants/atom";
import { useRouter } from "next/router";

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
  const recordList = useRecoilValue(recordListState);
  const userData = useRecoilValue(userDataState);
  const [goodList, setGoodList] = useState<GoodUser[]>([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!router.query.record) return;
    // recordList.forEach((record) => {
    const goodPostsRef = query(
      collectionGroup(db, "goodUsers"),
      orderBy("timeStamp", "desc"),
      where("postId", "==", router.query.record)
      // where("postId", "==", record.postId)
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
      // console.log(goodPostsData);
    });
    // });
  }, [router.query.record]);

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  return (
    <Layout>
      <Head>
        <title>Engineer Record GoodList</title>
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
              Goodしたユーザーがいません
            </Alert>
          )}
          <List
            sx={{
              mx: "auto",
              textAlign: "center",
              bgcolor: "background.paper",
            }}
          >
            {goodList.map((good) => {
              return (
                <ListItem key={good.key}>
                  <ListItemAvatar>
                    <Avatar src={good.photoURL} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={good.displayName}
                    secondary={good.createdAt}
                  />
                </ListItem>
              );
            })}
          </List>
        </>
      )}
    </Layout>
  );
};
export default GoodList;
