import { useState } from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import {
  Link,
  FlexWrap,
  TypingIntro,
  Divider,
  Button,
  JsonPayloadCard,
  Card,
  ProtectedPage,
  ChatComponent,
} from '../../components'
import { useConnection, useConversation, useTextAsyncAPI } from '../../hooks'
import { Transcripts, Topics } from '@symblai/react-elements'

const Index = () => {
  const [connectionId] = useConnection()
  const { conversationData } = useConversation()
  const [text, setText] = useState()
  const [textToProcess, setTextToProcess] = useState('')
  const { jobStatus, sentForProcessing } = useTextAsyncAPI(textToProcess)

  return (
    <ProtectedPage>
      <TypingIntro>Get insights from text format</TypingIntro>
      <Divider />
      <Link href="https://docs.symbl.ai/#text-api">
        The Async Text API allows you to process any text payload to get the
        transcription and conversational insights. It can be useful in any use
        case where you have access to the textual content of a type of
        conversation, and you want to extract the insightful items supported by
        the Conversation API. If you want to add more content to the same
        conversation, use PUT Async Text API. You can read more about Text API
      </Link>
      {connectionId ? (
        <label
          className={css(tw`text-indigo-300`)}
        >{`connectionId ${connectionId}`}</label>
      ) : null}
      <FlexWrap>
        <ChatComponent
          payload={JSON.stringify(text)}
          onChange={(jsonPayload: any) => {
            setText(jsonPayload)
          }}
        />
        <div className={css(tw`w-1/2 flex-1`)}>
          <textarea
            className={css(
              tw`bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none focus:border-gray-600 rounded py-1 px-2 pl-10 appearance-none leading-normal m-3 w-full h-full`
            )}
            value={JSON.stringify(text, null, 2)}
            onChange={(e) => setText(JSON.parse(e.target.value))}
          ></textarea>
        </div>
      </FlexWrap>
      <Button
        disabled={sentForProcessing}
        onClick={() => {
          setTextToProcess(JSON.stringify(text))
        }}
      >
        {!sentForProcessing
          ? `Submit messages insights for processing`
          : 'Processing'}
      </Button>
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
    </ProtectedPage>
  )
}

export default Index
