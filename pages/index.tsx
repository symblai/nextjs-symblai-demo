import { useState, useEffect, useRef } from 'react'
import { PhoneConfigurations } from '../components/PhoneConfigurations'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import io from 'socket.io-client'
import { Card } from '../components/Card'
import { TypingIntro } from '../components/TypingIntro'
import { Divider } from '../components/Divider'
import { useConnection, useConversation } from '../hooks'

const Index = () => {
  const [connectionId] = useConnection()
  const { conversationData } = useConversation()
  const [liveTranscript, setLiveTranscript] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const messagesList = useRef(messages)
  const insightsList = useRef(insights)

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
      <PhoneConfigurations insightTypes={['question', 'action_item']} />
      {connectionId ? (
        <label
          className={css(tw`text-indigo-300`)}
        >{`connectionId ${connectionId}`}</label>
      ) : null}
      <Divider />
      <div className={css(tw`flex flex-wrap`)}>
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
        <Card title="ConversationData">
          <div>
            <textarea
              className={css(tw`h-32 w-full bg-black p-4 mt-4`)}
              value={JSON.stringify(conversationData, null, 2)}
            />
            <div>
              With conversation data, you can call Conversation API to get lots
              of data. Read more{' '}
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
    </>
  )
}

export default Index
