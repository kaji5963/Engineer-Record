import { Card, Stack, Pagination } from "@mui/material";
import { useRecoilState } from "recoil";
import {
  commentItemState,
  commentListState,
  recordListState,
  userItemState,
  editItemState,
  bookmarkItemState,
  bookmarkListState,
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
} from "firebase/firestore";
import { db } from "./firebase";
import { blue } from "@mui/material/colors";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useRouter } from "next/router";
import { RecordItem } from "./RecordItem";

const RecordList = () => {
  const [recordList, setRecordList] = useRecoilState(recordListState);
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const [commentList, setCommentList] = useRecoilState(commentListState);
  const [commentItem, setCommentItem] = useRecoilState(commentItemState);
  const [editItem, setEditItem] = useRecoilState(editItemState);
  const [bookmarkItem, setBookmarkItem] = useRecoilState(bookmarkItemState);
  const [bookmarkList, setBookmarkList] = useRecoilState(bookmarkListState);
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  //firebaseからリアルタイムでデータを取得（firebaseの設定 collectionGroupをfirebase側で手動設定し降順）
  useEffect(() => {
    const recordsRef = query(
      collectionGroup(db, "records"),
      orderBy("timeStamp", "desc")
    );
    onSnapshot(recordsRef, (querySnapshot) => {
      const recordsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        uid: doc.data().uid,
        postId: doc.data().postId,
        value: doc.data().value,
        createdAt: doc.data().createdAt,
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL,
        saved: doc.data().saved,
      }));
      setRecordList(recordsData);
    });
  }, []);

  //最新のuser情報を取得（Profile更新に対応）
  useEffect(() => {
    const usersRef = query(collection(db, "users"));
    onSnapshot(usersRef, (querySnapshot) => {
      const userData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL,
      }));
      // console.log(userData);
      
    });
  },[])

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  //ページネーション関数結果をuseMemoでメモ化
  const paginationList = useMemo(() => {
    const startNumber = 0 + 9 * (currentPage - 1);
    const endNumber = 10 + 9 * (currentPage - 1);
    return recordList.slice(startNumber, endNumber);
  }, [currentPage, recordList]);

  //特定のコメントボタン押すと、そのデータをコメントページに渡す
  const handleComment = (id: string, postId: string) => {
    const findComment = recordList.find((record) => record.postId === postId);
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
      const deleteRecord = recordList.filter((record) => record.id !== id);
      setRecordList(deleteRecord);
    } else {
      return;
    }
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
      )}
    </>
  );
};

export default RecordList;
