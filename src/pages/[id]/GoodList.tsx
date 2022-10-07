import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import {
  collectionGroup,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../components/firebase";
import { useRecoilState, useRecoilValue } from "recoil";
import { recordListState, userDataState } from "../../constants/atom";
import Layout from "../../components/Layout";
import Head from "next/head";
import { Alert } from "@mui/material";

type GoodUser = {
  id: string;
  authorId: string;
  key: string;
  postId: string;
  value: string;
  createdAt: string;
  displayName: string;
  photoURL: string;
}
const GoodList = () => {
  const recordList = useRecoilValue(recordListState);
  const userData = useRecoilValue(userDataState);
  const [goodList, setGoodList] = useState<GoodUser[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const hoge = recordList.map((record) => {
      const goodUsersRef = query(
        collectionGroup(db, "goodPosts"),
        orderBy("timeStamp", "desc"),
        where("postId", "==", record.postId)
      );
    if (userData.length === 0) return;
    onSnapshot(goodUsersRef, (querySnapshot) => {
      const goodListData = Promise.all(querySnapshot.docs.map((doc) => {
        const goodListInfo = userData.find((user) => {
          return user.uid === doc.data().uid;
        });
        return {
          ...doc.data(),
          id: doc.id,
          uid: doc.data().uid,
          key: doc.data().key,
          postId: doc.data().postId,
          value: doc.data().value,
          createdAt: doc.data().createdAt,
          displayName: goodListInfo!.displayName,
          photoURL: goodListInfo!.photoURL,
        };
      }));
      return goodListData
    });
    })
    console.log(hoge)
  setGoodList([]);


  }, []);

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
            sx={{ mx: "auto", textAlign: "center", bgcolor: "background.paper" }}
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
