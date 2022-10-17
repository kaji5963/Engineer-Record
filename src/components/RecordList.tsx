import { Card, Stack, Pagination } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  commentItemState,
  recordListState,
  userItemState,
  editItemState,
  RecordList,
  userDataState,
} from "../constants/atom";
import React,{ useEffect, useMemo, useState } from "react";
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { useRouter } from "next/router";
import { RecordItem } from "./RecordItem";

const RecordList = () => {
  const userItem = useRecoilValue(userItemState);
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [userData, setUserData] = useRecoilState(userDataState);
  const [commentItem, setCommentItem] = useRecoilState(commentItemState);
  const [editItem, setEditItem] = useRecoilState(editItemState);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  //マウント時にfirebaseからusersのデータを取得、userDataに格納（１番目に動く）
  useEffect(() => {
    (async () => {
      const usersRef = query(collection(db, "users"));
      onSnapshot(usersRef, (querySnapshot) => {
        Promise.all(
          querySnapshot.docs.map(async (doc) => ({
            ...doc.data(),
            uid: doc.id,
            displayName: doc.data().displayName,
            photoURL: doc.data().photoURL,
          }))
        ).then((data) => setUserData(data));
      });
    })();
  }, [userItem]);

  //マウント時にfirebaseからrecordsのデータを取得、setRecordListに格納し画面表示（２番目に動く）
  //（firebaseの設定 collectionGroupをfirebase側で手動設定し降順）
  useEffect(() => {
    const recordsRef = query(
      collectionGroup(db, "records"),
      orderBy("timeStamp", "desc")
    );
    if (userData.length === 0) return;
    onSnapshot(recordsRef, (querySnapshot) => {
      const recordsData = querySnapshot.docs.map((doc) => {
        const userInfo = userData.find((user) => {
          return user.uid === doc.data().authorId
        });
        return {
          ...doc.data(),
          id: doc.id,
          authorId: doc.data().authorId,
          postId: doc.data().postId,
          value: doc.data().value,
          createdAt: doc.data().createdAt,
          displayName: userInfo!.displayName,
          photoURL: userInfo!.photoURL,
          goodCount: doc.data().goodCount
        };
      });
      setRecordList(recordsData);
    });
  }, [userData]);

  //ページネーション関数結果をuseMemoでメモ化
  const paginationList = useMemo(() => {
    const startNumber = 0 + 9 * (currentPage - 1);
    const endNumber = 10 + 9 * (currentPage - 1);
    return recordList.slice(startNumber, endNumber);
  }, [currentPage, recordList]);

  //recordのデータを格納、commentページへ遷移
  const handleComment = (postId: string) => {
    const findComment = recordList.find(
      (record) => record.postId === postId
    );
    setCommentItem({ ...commentItem, ...findComment });
    router.push(`/${postId}/Comment`);
  };

  //recordItemからsavedPostsを受け取りブックマークする処理
  const handleSavedBookmark = (savedPosts: RecordList) => {
    //ブックマークしたデータをfirebaseのbookmarksへ格納
    const bookmarksRef = doc(
      db,
      "users",
      userItem.uid,
      "bookmarks",
      savedPosts.postId
    );
    const { authorId, postId, value, createdAt } = savedPosts;
    setDoc(bookmarksRef, {
      bookmarkId: authorId,
      postId,
      value,
      createdAt,
      saved: true,
      timeStamp: serverTimestamp(),
    });
  };

  //recordItemからpostIdを受け取りブックマークを外す処理（firebaseのブックマークされたデータを削除）
  const handleRemoveBookmark = (postId: string) => {
    deleteDoc(doc(db, "users", userItem.uid, "bookmarks", postId));
  };

  //record編集処理
  const handleEditRecord = (postId: string) => {
    const findEditRecord = recordList.find(
      (record) => record.postId === postId
    );
    setEditItem({ ...editItem, ...findEditRecord });
    router.push(`/${postId}/EditRecord/`);
  };

  //record削除処理
  const handleDeleteRecord = (
    postId: string,
    commentExist: { id: string }[]
  ) => {
    const deleteMessage = confirm(
      `${userItem.displayName}の学習記録を削除してもよろしいですか？`
    );
    if (deleteMessage === true) {
      //recordsに紐づくcomments,bookmarks,goodPosts,goodUsersをバッチ処理
      const batch = writeBatch(db);
      batch.delete(doc(db, "users", userItem.uid, "records", postId));
      batch.delete(doc(db, "users", userItem.uid, "goodPosts", postId));
      batch.delete(doc(db, "users", userItem.uid, "bookmarks", postId));
      batch.delete(
        doc(db, "users", userItem.uid, "goodUsers", postId)
      );
      commentExist.forEach((comment) => {
        batch.delete(doc(db, "comments", comment.id));
      });
      batch.commit();
    } else return;
  };

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
      <Card
        sx={{
          maxWidth: 500,
          minWidth: 360,
          display: "flex",
          flexDirection: "column",
          mx: "auto",
          boxShadow: 0,
        }}
      >
        {paginationList &&
          paginationList.map((record) => {
            return (
              <RecordItem
                record={record}
                handleComment={handleComment}
                handleEditRecord={handleEditRecord}
                handleDeleteRecord={handleDeleteRecord}
                handleRemoveBookmark={handleRemoveBookmark}
                handleSavedBookmark={handleSavedBookmark}
                userItem={userItem}
                key={record.postId}
                router={router}
              />
            );
          })}
      </Card>
    </>
  );
};

export default RecordList;
