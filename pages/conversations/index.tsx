import { useState } from 'react'
import { PhoneConfigurations } from '../../components/PhoneConfigurations'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import {
  Card,
  FlexWrap,
  ConversationCard,
  TypingIntro,
  Divider,
  ProtectedPage,
  Link,
} from '../../components'
import { useConnection, useConversation, useAuth } from '../../hooks'

const INSIGHT_TYPES = ['question', 'action_item']
const Index = () => {
  const [connectionId, setConnectionId] = useConnection()
  const { conversationData, setConversationData } = useConversation()

  function handleConnection(data: any) {
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
      <Link href="https://docs.symbl.ai/#conversation-api">
        You can use Conversations API to retrieve lots of data from the
        conversation. Here you can either call your phone number or enter
        conversationId and retrieve different types of data for existing
        conversation.
      </Link>
      <Divider />
      <PhoneConfigurations
        clientOnly
        connectionResponseHandler={handleConnection}
        insightTypes={INSIGHT_TYPES}
      />
      {conversationData && conversationData.conversationId ? (
        <label
          className={css(tw`text-indigo-300`)}
        >{`conversationId ${conversationData.conversationId}`}</label>
      ) : null}
      <Divider />
      <FlexWrap>
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
      </FlexWrap>
    </ProtectedPage>
  )
}

export default Index
