import Head from 'next/head';
import { useState } from 'react';
import AddServerModal from '../components/add-server-modal';
import Layout from '../components/Layout';
import Navigation from '../components/navigation';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const [addServerModalIsOpen, setAddServerModalIsOpen] = useState(false);
  const handleAddServer = () => {
    console.log('add server clicked');
    setAddServerModalIsOpen(true);
  };

  return (
    <>
      <Head>
        <title>LeoparDB 🐆</title>
        <meta charSet='utf-8' />
        <meta
          name='description'
          content='The easiest way to visualize your databases'
        ></meta>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <h1 className='text-center text-2xl font-bold'>
        The easiest way to visualize your databases 🐆
      </h1>
      <div className='flex'>
        <div className=''>
          <Navigation addServer={handleAddServer} />
        </div>
        <div className=''>
          <Layout>
            <AddServerModal
              isOpen={addServerModalIsOpen}
              setIsOpen={() => {
                setAddServerModalIsOpen(false);
              }}
            />
            <Component {...pageProps} />
          </Layout>
        </div>
      </div>
    </>
  );
}
