import Layout from "./components/Layout";
import Head from "next/head";
import Form from "./components/Form";
import RecordList from "./components/RecordList";

const Top = () => {
  return (
    <Layout>
      <Head>
        <title>Engineer Record Top</title>
      </Head>
      <Form />
      <RecordList />
    </Layout>
  );
};

export default Top;
