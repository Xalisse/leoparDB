import Head from 'next/head';
import { useState } from 'react';
import AddServerModal from '../components/add-server-modal';
import Layout from '../components/Layout';
import Navigation from '../components/navigation';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const [addServerModalIsOpen, setAddServerModalIsOpen] = useState(false);
  const handleAddServer = () => {
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
      <div className='flex'>
        <div className=''>
          <Navigation addServer={handleAddServer} />
        </div>
        <div className='ml-[250px] w-[100%]'>
          <Layout>
            <AddServerModal
              isOpen={addServerModalIsOpen}
              setIsOpen={() => {
                setAddServerModalIsOpen(false);
              }}
            />
            <main>
              <Component {...pageProps} />
            </main>
          </Layout>
        </div>
      </div>
    </>
  );
}
