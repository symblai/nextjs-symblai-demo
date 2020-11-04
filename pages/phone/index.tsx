import { useState, useEffect, useRef } from 'react'
import { PhoneConfigurations } from '../../components/PhoneConfigurations'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import {
  Card,
  JsonPayloadCard,
  TypingIntro,
  FlexWrap,
  Divider,
  ProtectedPage,
  ConnectionLabel,
  Link,
} from '../../components'
import { Transcripts, Topics } from '@symblai/react-elements'
import { useConnection, useConversation, useAuth } from '../../hooks'

const INSIGHT_TYPES = ['question', 'action_item']
const Index = () => {
  const [connectionId, setConnectionId] = useConnection()
  const { token } = useAuth()
  const { conversationData, setConversationData } = useConversation()
  const [liveTranscript, setLiveTranscript] = useState<any>({})
  const [realtimeData, setRealTimeData] = useState({})
  const [messages, setMessages] = useState<any[]>([])
  const messagesList = useRef(messages)

  useEffect(() => {
    messagesList.current = messages
  }, [messages])

  function handleConnection(data: any) {
    console.log('Connection Data', data)
    setConnectionId(data.connectionId)
    setConversationData(data)
  }

  useEffect(() => {
    let ws: any = null

    if (conversationData && !ws) {
      ws = new WebSocket(
        `wss://api.symbl.ai/session/subscribe/${connectionId}?access_token=${token}`
      )

      ws.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data)
        if (data.type === 'message_response') {
          const oldMsgs = messagesList.current
          setMessages([...oldMsgs, ...data.messages])
        }
        if (data.type === 'transcript_response') {
          console.log(data.payload.content)
          setLiveTranscript(data)
        }

        setRealTimeData(data)
        console.log('Realtime data', data)
      }
    }

    // cleanup method which will be called before next execution. in your case unmount.
    return () => {
      ws && ws.close
    }
  }, [conversationData])

  return (
    <ProtectedPage>
      <TypingIntro>
        This is automatic calling machine to showcase Symbl.ai REST telephony
        API.
      </TypingIntro>
      <Divider />
      <Link href="https://docs.symbl.ai/#real-time-telephony-api">
        You can use Symbl REST API to call to your phone. You can test it there.
        After calling a phone you will get a conversationId that will help you
        retrieve bunch of insights from live coversation
      </Link>
      <Divider />
      <PhoneConfigurations
        clientOnly
        connectionResponseHandler={handleConnection}
        insightTypes={INSIGHT_TYPES}
      />
      <ConnectionLabel />
      <FlexWrap>
        <Card title="Live Transcription">
          <div>
            <div className="text-gray-500">Live transcription</div>
            <div>
              {liveTranscript.payload && liveTranscript.payload.content}
            </div>
          </div>
        </Card>
        <Card title="Messages">
          <div>
            <div className="text-gray-500">
              Meaningful messages that are parsed from transcriptions
            </div>
            <ul>
              {messages.map((message, index) => (
                <li key={`${message}-${index}`}>
                  {message.payload && message.payload.content}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </FlexWrap>
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
    </ProtectedPage>
  )
}

export default Index
