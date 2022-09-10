import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from "./components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <div>
        <Head>
          <title>Engineer Record</title>
        </Head>
        <h1>Engineer Record</h1>
        <button>Mainへ</button>
      </div>
    </Layout>
  );
}

export default Home
