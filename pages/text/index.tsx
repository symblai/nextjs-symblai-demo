import { useState } from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import { Link, FlexWrap, TypingIntro, Divider } from '../../components'
import { useConnection } from '../../hooks'

const Index = () => {
  const [connectionId] = useConnection()
  const [liveTranscript, setLiveTranscript] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [insights, setInsights] = useState<any[]>([])

  return (
    <>
      <TypingIntro>
        Text Insights capabilities are available, but not presented here in the
        app yet.
      </TypingIntro>
      <Divider />
      <Link href="https://docs.symbl.ai/#text-api">
        You can process text with Symbl as well. Even though the demo is still
        in progress, capabilities are there and pretty close to video and audio
        implementation. You can check out the docs for Async Text API
      </Link>
      {connectionId ? (
        <label
          className={css(tw`text-indigo-300`)}
        >{`connectionId ${connectionId}`}</label>
      ) : null}

      <FlexWrap></FlexWrap>
    </>
  )
}

export default Index
