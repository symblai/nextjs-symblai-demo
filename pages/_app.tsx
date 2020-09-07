import Head from 'next/head'
import '../styles/base.css'
import { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Symbl.ai NextJS app</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
