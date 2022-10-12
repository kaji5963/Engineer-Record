import Head from "next/head";
import TopLayout from "../components/Layout/TopLayout";
import Form from "../components/Form";
import RecordList from "../components/RecordList";
import React,{ useEffect, useState } from "react";

const Top = () => {
  const [isClient, setIsClient] = useState(false);

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  return (
    <TopLayout>
      <Head>
        <title>Engineer Record Top</title>
      </Head>
      {isClient && (
        <>
          <Form />
          <RecordList />
        </>
      )}
    </TopLayout>
  );
};

export default Top;
