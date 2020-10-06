import { useState } from 'react'
import { PhoneConfigurations } from '../../components/PhoneConfigurations'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import { Card } from '../../components/Card'
import { ConversationCard } from '../../components/ConversationCard'
import { TypingIntro } from '../../components/TypingIntro'
import { Divider } from '../../components/Divider'
import { ProtectedPage } from '../../components/ProtectedPage'
import { useConnection, useConversation, useAuth } from '../../hooks'

const INSIGHT_TYPES = ['question', 'action_item']
const Index = () => {
  const [connectionId, setConnectionId] = useConnection()
  const { token } = useAuth()
  const { conversationData, setConversationData } = useConversation()

  function handleConnection(data: any) {
    console.log('Connection Data', data)
    setConnectionId(data.connectionId)
    setConversationData(data)
  }

  return (
    <ProtectedPage>
      <TypingIntro>
        This page showcasing what you can do with Conversation API
      </TypingIntro>
      <Divider />
      <div className={css(tw`text-red-400 p-2`)}>
        You can use test conversationId:{' '}
        <span className={css(tw`text-blue-400`)}>6055920157065216</span> or call
        your phone and get conversationId from conversationData
      </div>
      <PhoneConfigurations
        clientOnly
        accessToken={token}
        connectionResponseHandler={handleConnection}
        insightTypes={INSIGHT_TYPES}
      />
      {conversationData && conversationData.conversationId ? (
        <label
          className={css(tw`text-indigo-300`)}
        >{`conversationId ${conversationData.conversationId}`}</label>
      ) : null}
      <Divider />
      <div className={css(tw`flex flex-wrap`)}>
        <Card title="ConnectionData">
          <div>
            <textarea
              className={css(tw`h-32 w-full bg-black p-4 mt-4`)}
              value={JSON.stringify(conversationData, null, 2)}
            />
            <div>
              Here you will see connection data. To check out API check here:
              <a
                className={css(tw`text-blue-400 p-4`)}
                href="https://docs.symbl.ai/#conversation-api"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </div>
          </div>
        </Card>
        <ConversationCard
          title="Messages"
          type="messages"
          token={token}
          conversationId={
            (conversationData && conversationData.conversationId) || ''
          }
        >
          <div>
            <div className="text-gray-500">
              Transcribed messages from conversation
              <span className="text-blue-400 p-2">
                api.symbl.ai/v1/conversations/[conversationId]/messages
              </span>
            </div>
          </div>
        </ConversationCard>
        <ConversationCard
          title="Participants"
          type="members"
          token={token}
          conversationId={
            (conversationData && conversationData.conversationId) || ''
          }
        >
          <div>
            <div className="text-gray-500">
              Get Participants or attendees of conversation
              <span className="text-blue-400 p-2">
                api.symbl.ai/v1/conversations/[conversationId]/members
              </span>
            </div>
          </div>
        </ConversationCard>
        <ConversationCard
          title="Insights"
          type="insights"
          token={token}
          conversationId={
            (conversationData && conversationData.conversationId) || ''
          }
        >
          <div>
            <div className="text-gray-500">
              Get Insights from conversation
              <span className="text-blue-400 p-2">
                api.symbl.ai/v1/conversations/[conversationId]/insights
              </span>
            </div>
          </div>
        </ConversationCard>
        <ConversationCard
          title="Topics"
          type="topics"
          token={token}
          conversationId={
            (conversationData && conversationData.conversationId) || ''
          }
        >
          <div>
            <div className="text-gray-500">
              Topics of conversation
              <span className="text-blue-400 p-2">
                api.symbl.ai/v1/conversations/[conversationId]/topics
              </span>
            </div>
          </div>
        </ConversationCard>
        <ConversationCard
          title="Questions"
          type="questions"
          token={token}
          conversationId={
            (conversationData && conversationData.conversationId) || ''
          }
        >
          <div>
            <div className="text-gray-500">
              Questions that were asked during conversation
            </div>
            <div className="text-blue-400 p-2">
              api.symbl.ai/v1/conversations/[conversationId]/questions
            </div>
          </div>
        </ConversationCard>
        <ConversationCard
          title="Follow ups"
          type="follow-ups"
          token={token}
          conversationId={
            (conversationData && conversationData.conversationId) || ''
          }
        >
          <div>
            <div className="text-gray-500">
              Insights of different types will be presented here. For example
              action items, questions, tasks etc
            </div>
            <span className="text-blue-400 p-2">
              api.symbl.ai/v1/conversations/[conversationId]/follow-ups
            </span>
          </div>
        </ConversationCard>
        <ConversationCard
          title="Action items"
          type="action-items"
          token={token}
          conversationId={
            (conversationData && conversationData.conversationId) || ''
          }
        >
          <div>
            <div className="text-gray-500">
              Action Items parsed from the conversation
            </div>
            <span className="text-blue-400 p-2">
              api.symbl.ai/v1/conversations/[conversationId]/action-items
            </span>
          </div>
        </ConversationCard>
      </div>
    </ProtectedPage>
  )
}

export default Index
