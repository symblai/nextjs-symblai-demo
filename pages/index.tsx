import { useState, useEffect } from 'react'
import { PhoneConfigurations } from '../components/PhoneConfigurations'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import io from 'socket.io-client'
import { Header } from '../components/Header'
import { Container } from '../components/Container'
import { Card } from '../components/Card'
import Typist from 'react-typist'
import Divider from '../components/Divider'

const Index = () => {
  const [connectionId, setConnectionId] = useState('')
  const [liveTranscript, setLiveTranscript] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    console.log('Connection Id:', connectionId)
    if (connectionId) {
      fetch('/api/subscribeToPhoneEvents', {
        method: 'POST',
        body: JSON.stringify({ connectionId: '' }),
      }).finally(() => {
        const socket = io()

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
            const msgArray = data.messages.map(
              (msg: any) => msg.payload.content
            )
            setNewMessage(msgArray)
          }
        })

        socket.on('disconnect', () => {
          console.log('disconnect')
        })
      })
    }
  }, [connectionId])

  useEffect(() => {
    console.log(newMessage, messages)
    if (newMessage !== messages[0]) {
      setMessages([newMessage, ...messages])
    }
  }, [newMessage, messages])
  return (
    <div
      className={[
        'bg-black-alt',
        css(tw`h-screen font-sans leading-normal tracking-normal`),
      ].join(' ')}
    >
      <Header />
      <Container>
        <div className={css(tw`hidden md:inline-block text-gray-100 my-5`)}>
          <Typist>
            This is automatic calling machine to showcase Symbl.ai telephony API
          </Typist>
        </div>
        <Divider />
        <PhoneConfigurations callHandler={(id) => setConnectionId(id)} />
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
                <li key={`${message}-${index}`}>{message}</li>
              ))}
            </ul>
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default Index
