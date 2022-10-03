import { Card, Stack, Pagination } from "@mui/material";
import { useRecoilState } from "recoil";
import {
  commentItemState,
  recordListState,
  userItemState,
  editItemState,
  RecordList,
} from "../constants/atom";
import { useEffect, useMemo, useState } from "react";
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
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { useRouter } from "next/router";
import { RecordItem } from "./RecordItem";

type User = {
  displayName: string;
  photoURL: string;
  timeStamp: Timestamp;
  uid: string;
}[];

const RecordList = () => {
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [commentItem, setCommentItem] = useRecoilState(commentItemState);
  const [editItem, setEditItem] = useRecoilState(editItemState);
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState<User>();
  const router = useRouter();

  //マウント時にfirebaseからusersのデータを取得、userDataに格納（１番目に動く）
  useEffect(() => {
    (async () => {
      const usersRef = query(collection(db, "users"));
      onSnapshot(usersRef, (querySnapshot) => {
        Promise.all(
          querySnapshot.docs.map(async (doc) => ({
            ...doc.data(),
            displayName: doc.data().displayName,
            photoURL: doc.data().photoURL,
            timeStamp: doc.data().timestamp,
            uid: doc.id,
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
    if (!userData) return;
    onSnapshot(recordsRef, (querySnapshot) => {
      const recordsData = querySnapshot.docs.map((doc) => {
        const userInfo = userData.find((user) => {
          return user.uid === doc.data().uid
        });
        // console.log(userInfo!.displayName, doc.data().displayName);
        return {
          ...doc.data(),
          id: doc.id,
          uid: doc.data().uid,
          postId: doc.data().postId,
          value: doc.data().value,
          createdAt: doc.data().createdAt,
          displayName: userInfo!.displayName,
          photoURL: userInfo!.photoURL,
        };
      });
      setRecordList(recordsData);
    });
    // console.log(userItem);
  }, [userData]);

  //ページネーション関数結果をuseMemoでメモ化
  const paginationList = useMemo(() => {
    const startNumber = 0 + 9 * (currentPage - 1);
    const endNumber = 10 + 9 * (currentPage - 1);
    return recordList.slice(startNumber, endNumber);
  }, [currentPage, recordList]);

  //特定のコメントボタン押すと、そのデータをコメントページに渡す
  const handleComment = (id: string, postId: string) => {
    const findComment = recordList.find(
      (record) => record.postId === postId
    );
    setCommentItem({ ...commentItem, ...findComment });
    router.push(`/${id}/Comment`);
  };

  //RecordItemからsavedPostsをpostDataとして受け取りブックマークする処理
  const handleSavedBookmark = (postData: RecordList) => {
    //ブックマークしたデータをfirebaseのbookmarksへ格納
    const bookmarksRef = doc(
      db,
      "users",
      userItem.uid,
      "bookmarks",
      postData.postId
    );
    setDoc(bookmarksRef, {
      ...postData,
      timeStamp: serverTimestamp(),
    });
  };

  //RecordItemからpostIdを受け取りブックマークを外す処理（firebaseのブックマークされたデータを削除）
  const handleRemoveBookmark = (postId: string) => {
    deleteDoc(doc(db, "users", userItem.uid, "bookmarks", postId));
  };

  //Record編集処理
  const handleEditRecord = (id: string, postId: string) => {
    const findEditRecord = recordList.find(
      (record) => record.postId === postId
    );
    setEditItem({ ...editItem, ...findEditRecord });
    router.push(`/${id}/EditRecord/`);
  };

  //Record削除処理
  const handleDeleteRecord = (id: string) => {
    const deleteMessage = confirm(
      `${userItem.displayName}の学習記録を削除してもよろしいですか？`
    );
    if (deleteMessage === true) {
      deleteDoc(doc(db, "users", userItem.uid, "records", id));
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
              />
            );
          })}
      </Card>
    </>
  );
};

export default RecordList;
