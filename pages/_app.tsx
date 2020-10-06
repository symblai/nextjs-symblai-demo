import Head from 'next/head'
import '../styles/base.css'
import { AppProps } from 'next/app'
import { css } from '@emotion/css'
import { Header } from '../components/Header'
import { Container } from '../components/Container'
import { ConnectionProvider } from '../hooks'
import tw from '@tailwindcssinjs/macro'
import { apiBase, appId, appSecret } from '../integrations/symbl/config'
import { SymblProvider } from '@symblai/react-elements'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConnectionProvider>
      <Head>
        <title>Symbl.ai NextJS app</title>
      </Head>
      <div
        className={[
          'bg-black-alt',
          css(tw`min-h-screen font-sans leading-normal tracking-normal`),
        ].join(' ')}
      >
        <Header />
        <Container>
          <SymblProvider
            config={{
              appId,
              appSecret,
              basePath: apiBase,
            }}
          >
            <Component {...pageProps} />
          </SymblProvider>
        </Container>
      </div>
    </ConnectionProvider>
  )
}
