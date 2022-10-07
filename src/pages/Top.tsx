import Head from "next/head";
import Layout from "../components/Layout";
import Form from "../components/Form";
import RecordList from "../components/RecordList";
import { useEffect, useState } from "react";

const Top = () => {
  const [isClient, setIsClient] = useState(false);

  //Hydrate Error対策
  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  return (
    <Layout>
      <Head>
        <title>Engineer Record Top</title>
      </Head>
      {isClient && (
        <>
          <Form />
          <RecordList />
        </>
      )}
    </Layout>
  );
};

export default Top;
