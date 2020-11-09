import { useState, useEffect, useRef } from 'react'
import { PhoneConfigurations } from '../components/PhoneConfigurations'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import io from 'socket.io-client'
import {
  Link,
  Card,
  TypingIntro,
  Divider,
  FlexWrap,
  JsonPayloadCard,
} from '../components'
import { useConnection, useConversation } from '../hooks'
import { Transcripts, Topics } from '@symblai/react-elements'

const Index = () => {
  const [connectionId] = useConnection()
  const [liveTranscript, setLiveTranscript] = useState('')
  const [realtimeData, setRealTimeData] = useState({})
  const [messages, setMessages] = useState<any[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const messagesList = useRef(messages)
  const insightsList = useRef(insights)
  const { conversationData, setConversationData } = useConversation()
  useEffect(() => {
    messagesList.current = messages
    insightsList.current = insights
  }, [messages, insights])

  let socket: any
  useEffect(() => {
    console.log('Connection Id:', connectionId)
    if (connectionId) {
      fetch('/api/subscribeToPhoneEvents', {
        method: 'POST',
      }).finally(() => {
        socket = io()
        socket.on('connect', () => {
          console.log('connect')
          socket.emit('subscribeToEvents', { connectionId })
        })

        socket.on('realtimeEvent', (data: any) => {
          console.log('Real time event', data)
          setRealTimeData(data)
          setConversationData(data)
          if (data.type === 'transcript_response') {
            setLiveTranscript(data.payload.content)
          }
          if (data.type === 'message_response') {
            const oldMsgs = messagesList.current
            setMessages([...oldMsgs, ...data.messages])
          }
          if (data.type === 'insight_response') {
            const oldInsights = insightsList.current
            setInsights([...oldInsights, ...data.insights])
          }
        })

        socket.on('disconnect', () => {
          console.log('disconnect')
        })
      })
    }
  }, [connectionId])

  return (
    <>
      <TypingIntro>
        This is automatic calling machine to showcase Symbl.ai telephony API.
        This example is using Symbl Node SDK on server side and socket.io
        connection on the client side
      </TypingIntro>
      <Divider />
      <Link href="https://docs.symbl.ai/#get-live-transcription-phone-call-node-js-telephony">
        On this page you can see how to initiate a phone call using Symbl Node
        SDK. There is a call from this page to api/call endpoint that executes
        the call on the NodeJS side. Connection to the client is via websockets
        using socket.io. You can read more about how to use Symbl.ai in Node
      </Link>
      <Divider />
      <PhoneConfigurations insightTypes={['question', 'action_item']} />
      {connectionId ? (
        <label
          className={css(tw`text-indigo-300`)}
        >{`connectionId ${connectionId}`}</label>
      ) : null}
      <Divider />

      <FlexWrap>
        <Card title="Live Transcriptions">
          <div>
            <div className="text-gray-500">
              Live transcripts will show live transcription process.
            </div>
            <div>{liveTranscript}</div>
          </div>
        </Card>
        <Card title="Messages">
          <div>
            <div className="text-gray-500">
              Meaningful messages that are parsed from transcriptions
            </div>
            <ul>
              {messages.map((message, index) => (
                <li key={`${message}-${index}`}>{message.payload.content}</li>
              ))}
            </ul>
          </div>
        </Card>
        <Card title="Insights">
          <div>
            <div className="text-gray-500">
              Insights of different types will be presented here. For example
              action items, questions, tasks etc
            </div>
            <ul>
              {insights.map((insight, index) => (
                <li key={`${insight}-${index}`}>{insight.text}</li>
              ))}
            </ul>
          </div>
        </Card>
      </FlexWrap>
      <Divider />
      <h1 className={css(tw`text-white text-xl p-8 justify-center flex`)}>
        Symbl React Elements library
      </h1>
      <Divider />
      <FlexWrap>
        <Card title="Transcriptions using Symbl react elements">
          <div>
            <div className="text-gray-500">
              This UI is using predefined Transcripts element from{' '}
              <a
                href="https://www.npmjs.com/package/@symblai/react-elements"
                className={css(tw`text-blue-400`)}
              >
                @symblai/react-elements
              </a>
            </div>
            <div className={css(tw`pt-4`)}>
              {messages && <Transcripts messages={messages} />}
            </div>
          </div>
        </Card>
        <Card title="Topics using Symbl react elements">
          <div>
            <div className="text-gray-500">
              This UI is using predefined Topics element from{' '}
              <a
                href="https://www.npmjs.com/package/@symblai/react-elements"
                className={css(tw`text-blue-400`)}
              >
                @symblai/react-elements
              </a>
            </div>
            <div className={css(tw`pt-4`)}>
              {conversationData && conversationData.conversationId && (
                <Topics conversationId={conversationData.conversationId} />
              )}
            </div>
          </div>
        </Card>
      </FlexWrap>
      <Divider />
      <h1 className={css(tw`text-white text-xl p-8 justify-center flex`)}>
        Raw Data
      </h1>
      <Divider />
      <FlexWrap>
        <JsonPayloadCard
          json={realtimeData}
          title="Realtime data from websocket"
        >
          <div>Realtime data</div>
        </JsonPayloadCard>
        <JsonPayloadCard json={conversationData} title="Connection data">
          <div>Connection data</div>
        </JsonPayloadCard>
      </FlexWrap>
    </>
  )
}

export default Index
