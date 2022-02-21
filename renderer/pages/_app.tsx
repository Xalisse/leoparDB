import axios from "axios";
import Head from "next/head";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Navigation from "../components/navigation";
import { Database } from "../interfaces";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const [databases, setDatabases] = useState<Database[]>([]);
  useEffect(() => {
    async function fetchDatabases() {
      const response = await axios.post(
        "/api/databases",
        {
          type: "mysql",
          host: "localhost",
          port: 3306,
          username: "root",
          password: "root",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status}`);
      }
      setDatabases(response.data);
    }

    fetchDatabases();
  }, []);

  return (
    <>
      <Head>
        <title>LeoparDB 🐆</title>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="The easiest way to visualize your databases"
        ></meta>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1 className="font-bold text-2xl text-center">
        The easiest way to visualize your databases 🐆
      </h1>
      <div className="flex">
        <div className="">
          <Navigation {...{ databases }} />
        </div>
        <div className="">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </div>
      </div>
    </>
  );
}
