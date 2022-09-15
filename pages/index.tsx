import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css'
import Layout from "./components/Layout";

const Home: NextPage = () => {
  const router = useRouter()
  return (
    <Layout>
      <div>
        <Head>
          <title>Engineer Record</title>
        </Head>
        <h1>Engineer Record</h1>
        <button onClick={() => router.push("/Signup")}>Mainへ</button>
      </div>
    </Layout>
  );
}

export default Home
