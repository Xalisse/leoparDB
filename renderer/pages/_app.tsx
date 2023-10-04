import Head from 'next/head';
import Navigation from '../components/navigation';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
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

      <div className='grid h-full grid-cols-[230px_1fr]'>
        <Navigation />
        <div className='overflow-scroll'>
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}
