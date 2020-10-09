import React, { useState } from 'react'
import { useMessages, useConversation } from '../hooks'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import { Card, Button } from '../components'
type VideoMessagesProps = {
  setPlaybackTime: any
}
export const VideoMessages: React.FC<VideoMessagesProps> = ({
  setPlaybackTime,
}) => {
  const { conversationData } = useConversation()
  const { data: messages, fetchData } = useMessages()
  const transcriptItemClicked = async (data: any) => {
    console.log('on list item click', data, setPlaybackTime)
    if (data && data.length > 2) {
      setPlaybackTime(data[2])
    }
  }

  return (
    <Card title="Transcript">
      <div>
        <ul>
          {messages &&
            (messages as any[]).map((data, index) => (
              <div
                className={css(tw`text-blue-400 cursor-pointer`)}
                onClick={() => transcriptItemClicked(data)}
                key={`data-${index}`}
              >
                {data[1]}
              </div>
            ))}
        </ul>
        {conversationData && conversationData.conversationId ? (
          <Button
            onClick={() =>
              fetchData(conversationData ? conversationData.conversationId : '')
            }
          >
            Show transcription
          </Button>
        ) : null}
      </div>
    </Card>
  )
}
