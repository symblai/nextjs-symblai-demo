import { useState, useEffect, useRef, MutableRefObject, useMemo } from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import {
  Card,
  ConversationCard,
  TypingIntro,
  Divider,
  ProtectedPage,
  FileOrUrlInput,
  FileOrUrlInputSubmitType,
  FlexWrap,
  JsonPayloadCard,
  Link,
  ParamsToggle,
  AsyncParamsUI,
} from '../../components'

import {
  useConversation,
  useAudioAsyncAPI,
  useAsyncApiParams,
} from '../../hooks'
import { Transcripts, Topics } from '@symblai/react-elements'

const Index = () => {
  const { conversationData } = useConversation()
  const [file, setFile] = useState()
  const [audioUrl, setAudioUrl] = useState('')

  const asyncApiParams = useAsyncApiParams()
  const { jobStatus, sentForProcessing } = useAudioAsyncAPI(
    audioUrl !== '' ? audioUrl : file,
    asyncApiParams.query
  )

  const onAudioSubmit = async (data: FileOrUrlInputSubmitType) => {
    if (data.type === 'file') {
      setFile(data?.file as any)
    } else {
      setAudioUrl(data?.url as string)
    }
  }

  const shouldRenderInput =
    (jobStatus as any)?.status !== 'in_progress' &&
    !jobStatus &&
    !sentForProcessing

  const transcodingCaption =
    sentForProcessing && !jobStatus
      ? 'Transcoding...'
      : jobStatus && (jobStatus as any).status === 'in_progress'
      ? `Processing with Symbl...`
      : 'Processed and ready'

  return (
    <ProtectedPage>
      <TypingIntro>
        This page showcasing what you can do with Async Audio and Conversation
        API
      </TypingIntro>
      <Divider />
      <Link href="https://docs.symbl.ai/#audio-api">
        You can also process audio files or urls with Symbl and get insights.
        You can check out the docs on more API info
      </Link>
      <Divider />
      <div className={css(tw`text-red-400 p-2`)}>
        You can use either mp3 or wav url or upload a file
      </div>
      {shouldRenderInput ? (
        <FileOrUrlInput onSubmit={onAudioSubmit} />
      ) : (
        <div className={css(tw`text-blue-400 p-2`)}>{transcodingCaption}</div>
      )}
      <Divider />
      <ParamsToggle>
        <AsyncParamsUI {...asyncApiParams} />
      </ParamsToggle>
      <Divider />
      <FlexWrap>
        <JsonPayloadCard title="Job Processing data" json={jobStatus}>
          <div>Job Processing data</div>
        </JsonPayloadCard>
        <JsonPayloadCard title="ConnectionData" json={conversationData}>
          <div>
            Here you will see Connection data. To check out API check here:
            <a
              className={css(tw`text-blue-400 p-4`)}
              href="https://docs.symbl.ai/#conversation-api"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
          </div>
        </JsonPayloadCard>
      </FlexWrap>
      <Divider />
      <FlexWrap>
        <Card title="Transcriptions using Symbl react elements">
          <div>
            <div className="text-gray-500">
              This transcript are using predefined Transcripts element from{' '}
              <a
                href="https://www.npmjs.com/package/@symblai/react-elements"
                className={css(tw`text-blue-400`)}
              >
                @symblai/react-elements
              </a>
            </div>
            {jobStatus && (jobStatus as any).status === 'completed' && (
              <Transcripts conversationId={conversationData.conversationId} />
            )}
          </div>
        </Card>
        <Card title="Topics using Symbl react elements">
          <div>
            <div className="text-gray-500">
              This transcript are using predefined Transcripts element from{' '}
              <a
                href="https://www.npmjs.com/package/@symblai/react-elements"
                className={css(tw`text-blue-400`)}
              >
                @symblai/react-elements
              </a>
            </div>
            {jobStatus && (jobStatus as any).status === 'completed' && (
              <Topics conversationId={conversationData.conversationId} />
            )}
          </div>
        </Card>
      </FlexWrap>
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
