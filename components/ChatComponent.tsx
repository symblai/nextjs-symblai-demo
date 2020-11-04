import React, { useState } from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import { Button } from '../components'

const Chat = ({ messages }: any) => {
  return (
    <ul>
      {messages.map((message: any, index: any) => (
        <li key={index}>
          <div>
            <div
              className={css(
                tw`relative flex justify-between py-2 m-4 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white transition duration-150 ease-in-out bg-teal-600
                `
              )}
            >
              <label>from: {message.from.name}</label>
              <div>userId: {message.from.userId}</div>
            </div>
            <div
              className={css(
                tw`text-gray-400 transition placeholder-gray-600 rounded py-1 px-2 appearance-none leading-normal m-3 w-full`
              )}
            >
              {message.payload.content}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export const ChatComponent = ({
  onChange,
  payload,
}: {
  onChange: (jsonPayload: any) => void
  payload: string
}) => {
  const [speaker, setSpeaker] = useState('')
  const [userId, setUserId] = useState('')
  const [message, setMessage] = useState('')
  const [
    detectActionPhraseForMessages,
    setDetectActionPhraseForMessages,
  ] = useState(false)
  const [conversationType, setConversationType] = useState('')
  const jsonPayload = JSON.parse(payload || '{}')

  const addMessage = () => {
    const messages = jsonPayload.messages || []
    if (!message || !speaker) {
      alert('No Speaker or Message')
    } else {
      const metadata = conversationType
        ? {
            metadata: {
              conversationType: conversationType.split(','),
            },
          }
        : {}
      const newData = {
        ...metadata,
        detectActionPhraseForMessages,
        confidenceThreshold: 0.5,
        messages: [
          ...messages,
          {
            payload: {
              content: message,
            },
            from: {
              userId,
              name: speaker,
            },
            duration: {
              startTime: new Date().toISOString(),
              endTime: new Date().toISOString(),
            },
          },
        ],
      }
      onChange(newData)
    }
  }
  return (
    <div className={css(tw`w-full md:w-1/2 xl:w-1/2 p-3`)}>
      <div
        className={css(
          tw`bg-gray-900 border border-gray-800 rounded shadow p-2`
        )}
      >
        <div className={css(tw`flex flex-row items-center`)}>
          <div className={css(tw`flex-1 text-center`)}>
            <h5 className={css(tw`font-bold uppercase text-gray-400`)}>
              Chat Example
            </h5>
            <input
              type="text"
              value={conversationType}
              placeholder="Conversation Type"
              className={css(
                tw`block bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none placeholder-gray-600 focus:border-gray-600 rounded py-1 px-2 appearance-none leading-normal m-3 w-64`
              )}
              name="name"
              onChange={(e) => {
                setConversationType(e.target.value)
              }}
            />
            <input
              type="checkbox"
              checked={detectActionPhraseForMessages}
              onChange={() => {
                setDetectActionPhraseForMessages(!detectActionPhraseForMessages)
              }}
            ></input>
            <label
              className={css(
                tw`text-gray-400 transition placeholder-gray-600 rounded py-1 px-2 appearance-none leading-normal m-3 w-64`
              )}
            >
              detectActionPhraseForMessages
            </label>
          </div>
        </div>
        <div>
          {jsonPayload.messages && <Chat messages={jsonPayload.messages} />}
        </div>
        <div>
          <input
            type="text"
            value={speaker}
            placeholder="from(name)"
            className={css(
              tw`inline-block bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none placeholder-gray-600 focus:border-gray-600 rounded py-1 px-2 appearance-none leading-normal m-3 w-64`
            )}
            name="name"
            onChange={(e) => {
              setSpeaker(e.target.value)
            }}
          />
          <input
            type="text"
            value={userId}
            placeholder="userId"
            className={css(
              tw`inline-block bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none placeholder-gray-600 focus:border-gray-600 rounded py-1 px-2 appearance-none leading-normal m-3 w-64`
            )}
            name="userId"
            onChange={(e) => {
              setUserId(e.target.value)
            }}
          />
          <textarea
            value={message}
            placeholder="message"
            className={css(
              tw`inline-block bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none placeholder-gray-600 focus:border-gray-600 rounded py-1 px-2 appearance-none leading-normal m-3 w-64`
            )}
            name="speaker"
            onChange={(e) => {
              setMessage(e.target.value)
            }}
          />
        </div>
        <Button
          className={css(tw`text-gray-400`)}
          onClick={() => {
            addMessage()
          }}
        >
          Add Message
        </Button>
      </div>
    </div>
  )
}
