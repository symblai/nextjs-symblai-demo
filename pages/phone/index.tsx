import { useState, useEffect, useRef } from 'react'
import { PhoneConfigurations } from '../../components/PhoneConfigurations'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import { Card } from '../../components/Card'
import { TypingIntro } from '../../components/TypingIntro'
import { Divider } from '../../components/Divider'
import { ProtectedPage } from '../../components/ProtectedPage'
import { useConnection, useConversation, useAuth } from '../../hooks'
import {
  SymblProvider,
  Transcripts,
  WSMessageList,
} from '@symblai/react-elements'
import { apiBase, appId, appSecret } from '../../integrations/symbl/config'

const INSIGHT_TYPES = ['question', 'action_item']
const Index = () => {
  const [connectionId, setConnectionId] = useConnection()
  const { token } = useAuth()
  const { conversationData, setConversationData } = useConversation()
  const [liveTranscript, setLiveTranscript] = useState<WSMessageList[]>([])
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
        `wss://api.symbl.ai/session/subscribe/${conversationData.conversationId}?access_token=${token}`
      )

      const subscribeToWebsocket = () => {
        ws.onmessage = (event: any) => {
          const response = JSON.parse(event.data)
          console.log('Realtime events', response)
        }
      }

      subscribeToWebsocket()

      ws.onclose = () => {
        subscribeToWebsocket()
      }
    }

    // cleanup method which will be called before next execution. in your case unmount.
    return () => {
      ws && ws.close
    }
  }, [conversationData])

  console.log(token)
  return (
    <ProtectedPage>
      <TypingIntro>
        This is automatic calling machine to showcase Symbl.ai REST telephony
        API.
      </TypingIntro>
      <Divider />
      <PhoneConfigurations
        clientOnly
        accessToken={token}
        connectionResponseHandler={handleConnection}
        insightTypes={INSIGHT_TYPES}
      />
      {connectionId ? (
        <label
          className={css(tw`text-indigo-300`)}
        >{`connectionId ${connectionId}`}</label>
      ) : null}
      <Divider />
      <div className={css(tw`flex flex-wrap`)}>
        <Card title="Live Transcriptions">
          <div>
            {conversationData && conversationData.conversationId && (
              <Transcripts
                onMessageResponse={() => (msgs: WSMessageList[]) =>
                  setLiveTranscript(msgs)}
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
        <Card title="ConnectionData">
          <div>
            <textarea
              className={css(tw`h-32 w-full bg-black p-4 mt-4`)}
              value={JSON.stringify(conversationData, null, 2)}
            />
            <div>
              Here you will see connection data.
              <a
                className={css(tw`text-blue-400`)}
                href="https://docs.symbl.ai/#conversation-api"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </div>
          </div>
        </Card>
      </div>
    </ProtectedPage>
  )
}

export default Index
