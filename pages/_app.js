import '@styles/globals.css'
import '../styles/landing.css';
import '../styles/header.css';
import '../styles/footer.css';
import '../styles/category.css';
import '../styles/index.css';
import '../styles/hero.css'
import '../styles/category.css';
import Head from 'next/head';

function Application({ Component, pageProps }) {
  <Head>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </Head>
  return <Component {...pageProps} />
}

export default Application
