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
  ConversationCard,
  Link,
} from '../../components'
import { useConnection, useConversation, useAuth } from '../../hooks'
import { Transcripts } from '@symblai/react-elements'

const INSIGHT_TYPES = ['question', 'action_item']
const Index = () => {
  const [connectionId, setConnectionId] = useConnection()
  const { token } = useAuth()
  const { conversationData, setConversationData } = useConversation()
  const [liveTranscript, setLiveTranscript] = useState([])
  const [realtimeData, setRealTimeData] = useState({})
  const [messages, setMessages] = useState<any[]>([])
  const [insights, setInsights] = useState<any[]>([])

  function handleConnection(data: any) {
    console.log('Connection Data', data)
    setConnectionId(data.connectionId)
    setConversationData(data)
  }

  useEffect(() => {
    let ws: any = null

    if (conversationData && !ws) {
      ws = new WebSocket(
        `wss://api.symbl.ai/v1/realtime/insights/${connectionId}?access_token=${token}`
      )

      ws.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data)
        console.log('Response', data)
        setRealTimeData(data)
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
      <Divider />
      <FlexWrap>
        <ConversationCard
          title="Messages"
          type="messages"
          conversationId={
            (conversationData && conversationData.conversationId) || ''
          }
        >
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
        </ConversationCard>
        <ConversationCard
          title="Insights"
          type="insights"
          conversationId={
            (conversationData && conversationData.conversationId) || ''
          }
        >
          <div>
            <div className="text-gray-500">
              Insights of different types will be presented here. For example
              action items, questions, tasks etc
            </div>
          </div>
        </ConversationCard>
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
          <div>Realtime data</div>
        </JsonPayloadCard>
        <Card title="Live Transcriptions">
          <div>
            {conversationData && conversationData.conversationId && (
              <Transcripts
                onMessageResponse={(updateLiveTranscripts) =>
                  updateLiveTranscripts(liveTranscript)
                }
              />
            )}
            <div className="text-gray-500">
              This transcript are using predefined Transcripts element from{' '}
              <a
                href="https://www.npmjs.com/package/@symblai/react-elements"
                className={css(tw`text-blue-400`)}
              >
                @symblai/react-elements
              </a>
            </div>
            <textarea
              className={css(tw`h-32 w-full bg-black p-4 mt-4`)}
              value={JSON.stringify(liveTranscript, null, 2)}
            />
          </div>
        </Card>
      </FlexWrap>
    </ProtectedPage>
  )
}

export default Index
