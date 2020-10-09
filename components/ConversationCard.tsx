import React, { useState, useEffect } from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import { Button, Card } from '../components'
import { useAuth } from '../hooks'
const CONVERSATION_API = 'https://api.symbl.ai/v1/conversations'

export const ConversationCard = ({
  title,
  children,
  conversationId: cId,
  type,
}: {
  title: string
  conversationId: string
  children: JSX.Element
  type:
    | 'messages'
    | 'insights'
    | 'topics'
    | 'members'
    | 'questions'
    | 'follow-ups'
    | 'action-items'
}) => {
  const { token } = useAuth()
  const [conversationId, setConverstationId] = useState(cId)
  const [responseData, setResponseData] = useState()

  const endpoint = type ? type : ''
  const fetchData = async () => {
    const res = await fetch(
      `${CONVERSATION_API}/${conversationId}/${endpoint}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': token as string,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      }
    )

    const json = await res.json()
    setResponseData(json)
  }

  useEffect(() => {
    if (cId) {
      setConverstationId(cId)
    }
  }, [cId])
  return (
    <Card title={title}>
      <>
        {children}
        <div className={css(tw`flex`)}>
          <input
            onChange={(e) => setConverstationId(e.target.value)}
            type="text"
            value={conversationId}
            placeholder="conversationId"
            className={css(
              tw`flex flex-wrap bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none focus:border-gray-600 rounded py-1 px-2 pl-10 appearance-none leading-normal m-3 w-64`
            )}
          />
          <Button
            onClick={() => {
              if (conversationId) {
                fetchData()
              } else
                alert(
                  'No conversationId provided, please provide conversationId'
                )
            }}
          >
            Fetch Data from API
          </Button>
        </div>
        <textarea
          className={css(tw`h-32 w-full bg-black p-4 mt-4`)}
          value={JSON.stringify(responseData, null, 2)}
        />
      </>
    </Card>
  )
}
