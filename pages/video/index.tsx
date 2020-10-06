import { useState } from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import { Card } from '../../components/Card'
import { TypingIntro } from '../../components/TypingIntro'
import { Divider } from '../../components/Divider'
import { useConnection } from '../../hooks'

const Index = () => {
  const [connectionId] = useConnection()
  const [liveTranscript, setLiveTranscript] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [insights, setInsights] = useState<any[]>([])

  return (
    <>
      <TypingIntro>Video typing intro</TypingIntro>
      <Divider />
      {connectionId ? (
        <label
          className={css(tw`text-indigo-300`)}
        >{`connectionId ${connectionId}`}</label>
      ) : null}
      <Divider />
      <div className={css(tw`flex flex-wrap`)}>
        <Card title="Live Transcriptions">
          <div>{liveTranscript}</div>
        </Card>
        <Card title="Messages">
          <ul>
            {messages.map((message, index) => (
              <li key={`${message}-${index}`}>{message.payload.content}</li>
            ))}
          </ul>
        </Card>
        <Card title="Insights">
          <ul>
            {insights.map((insight, index) => (
              <li key={`${insight}-${index}`}>{insight.payload.content}</li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}

export default Index
