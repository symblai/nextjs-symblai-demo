import { useState, useEffect, useRef, MutableRefObject, useMemo } from 'react'
import { PhoneConfigurations } from '../../components/PhoneConfigurations'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import { Card } from '../../components/Card'
import { ConversationCard } from '../../components/ConversationCard'
import { TypingIntro } from '../../components/TypingIntro'
import { Divider } from '../../components/Divider'
import { ProtectedPage } from '../../components/ProtectedPage'
import { useConversation, useAuth } from '../../hooks'
import Transcoder from '../../components/Transcoder'
import Button from '../../components/Button'
import { Transcripts, Topics } from '@symblai/react-elements'

const MIME_TYPES = {
  mp3: 'audio/mpeg',
  wav: 'audio/wave',
}

export function useAudioAsyncAPI(data: File | string | undefined) {
  const { token } = useAuth()
  const { conversationData, setConversationData } = useConversation()
  const [sentForProcessing, setSentForProcessing] = useState(false)
  const [jobStatus, setJobStatus] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    async function transcodeFile(_file: File) {
      // tslint:disable-next-line
      const transcoder = new (Transcoder as any)()
      const transcodedFile = await transcoder.load(_file)
      return transcodedFile
    }

    const isFile = data instanceof File

    async function fetchData() {
      const urlAudio = isFile
        ? 'https://api.symbl.ai/v1/process/audio'
        : 'https://api.symbl.ai/v1/process/audio/url'
      const requestOptions = {
        method: 'GET',
        headers: {
          'x-api-key': token,
        },
      }
      async function getFileOrUrlOptions() {
        if (isFile) {
          console.log('Get File  options')
          const file = data
          const transcodedFile: any = await transcodeFile(file as File)
          console.log('fetch data?', file, transcodeFile)
          const requestOptionsAudio = {
            method: 'POST',
            headers: {
              'x-api-key': token,
              'Content-Type': MIME_TYPES['mp3'],
            },
            body: transcodedFile,
            signal: controller.signal,
          }
          return requestOptionsAudio
        } else {
          console.log('get url options')
          const url = data
          const requestOptionsAudio = await {
            method: 'POST',
            headers: {
              'x-api-key': token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: url,
              confidenceThreshold: 0.6,
              timezoneOffset: 0,
            }),
          }
          return requestOptionsAudio
        }
      }

      async function check(jobId: string) {
        const checkJob = await fetch(
          `https://api.symbl.ai/v1/job/${jobId}`,
          requestOptions
        )
        const checkJobJson = await checkJob.json()
        setJobStatus(checkJobJson)
        if (checkJobJson.status === 'in_progress') {
          check(jobId)
          return
        } else {
          setSentForProcessing(false)
        }
      }
      try {
        if (!jobStatus) {
          setSentForProcessing(true)
          const requestOptionsAudio = await getFileOrUrlOptions()
          const processingResponse = await fetch(urlAudio, requestOptionsAudio)
          const processingResponseJson = await processingResponse.json()
          check(processingResponseJson.jobId)
          setConversationData(processingResponseJson)
        }
      } catch (err) {
        console.error(err, err.message)
      }
    }

    data && fetchData().catch((err) => console.log(err.message))
    return () => {
      controller.abort()
    }
  }, [data, conversationData, setConversationData])

  return {
    jobStatus,
    setJobStatus,
    sentForProcessing,
  }
}

type AudioSubmitType = {
  file?: File
  url?: string
  type: 'url' | 'file'
}

const AudioUrlOrFile = ({
  onSubmit,
}: {
  onSubmit: (data: AudioSubmitType) => void
}) => {
  const inputRef = useRef()
  const [type, setType] = useState('file')
  const [url, setUrl] = useState('')
  return (
    <div>
      <label
        htmlFor="toogleA"
        className={css(tw`p-4 flex items-center cursor-pointer`)}
      >
        <div className={css(tw`relative`)}>
          <input
            id="toogleA"
            type="checkbox"
            className={css(tw`hidden`)}
            onChange={() => (type === 'url' ? setType('file') : setType('url'))}
          />
          <div
            className={css(tw`w-10 h-4 bg-gray-400 rounded-full shadow-inner`)}
          ></div>
          <div
            className={css(
              tw`absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0`,
              `top: -.25rem;
                left: -.25rem;
                transition: all 0.3s ease-in-out;`,
              type === 'file'
                ? ``
                : `  transform: translateX(100%);
                background-color: #48bb78;`
            )}
          ></div>
        </div>
        <div className={css(tw`ml-3 text-blue-400 font-medium`)}>Url</div>
      </label>
      <div className={css(tw`flex`)}>
        {type === 'url' ? (
          <input
            className={css(
              tw`flex flex-wrap bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none focus:border-gray-600 rounded py-1 px-2 pl-10 appearance-none leading-normal m-3 w-64`
            )}
            type="text"
            id="input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        ) : (
          <input
            className={css(
              tw`flex flex-wrap bg-gray-900 text-sm text-gray-400 transition border border-gray-800 focus:outline-none focus:border-gray-600 rounded py-1 px-2 pl-10 appearance-none leading-normal m-3 w-64`
            )}
            type="file"
            id="input"
            accept="audio/*, video/*"
            ref={inputRef as MutableRefObject<any>}
          />
        )}
        <Button
          onClick={() => {
            onSubmit({
              type: type as 'file' | 'url',
              url,
              file: (inputRef as any)?.current?.files[0],
            })
          }}
        >
          {`Submit ${type === 'file' ? 'File' : 'Url'} for processing`}
        </Button>
      </div>
    </div>
  )
}

const Index = () => {
  const { token } = useAuth()
  const { conversationData } = useConversation()
  const [file, setFile] = useState()
  const [audioUrl, setAudioUrl] = useState('')
  const { jobStatus, sentForProcessing } = useAudioAsyncAPI(
    audioUrl !== '' ? audioUrl : file
  )

  const onAudioSubmit = async (data: AudioSubmitType) => {
    if (data.type === 'file') {
      setFile(data?.file as any)
    } else {
      setAudioUrl(data?.url as string)
    }
  }

  return (
    <ProtectedPage>
      <TypingIntro>
        This page showcasing what you can do with Conversation API
      </TypingIntro>
      <Divider />
      <div className={css(tw`text-red-400 p-2`)}>
        You can use either mp3 or wav url or upload a file
      </div>
      {(jobStatus as any)?.status !== 'in_progress' &&
      !jobStatus &&
      !sentForProcessing ? (
        <AudioUrlOrFile onSubmit={onAudioSubmit} />
      ) : (
        <div className={css(tw`text-blue-400 p-2`)}>
          {sentForProcessing && !jobStatus
            ? 'Transcoding...'
            : jobStatus && (jobStatus as any).status === 'in_progress'
            ? `Processing with Symbl...`
            : 'Processed and ready'}
        </div>
      )}
      <Divider />
      <div className={css(tw`flex flex-wrap`)}>
        <Card title="Job Processing data">
          <div>
            <textarea
              className={css(tw`h-32 w-full bg-black p-4 mt-4`)}
              value={JSON.stringify(jobStatus, null, 2)}
            />
            <div>Job Processing data</div>
          </div>
        </Card>
        <Card title="ConnectionData">
          <div>
            <textarea
              className={css(tw`h-32 w-full bg-black p-4 mt-4`)}
              value={JSON.stringify(conversationData, null, 2)}
            />
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
          </div>
        </Card>
      </div>
      <Divider />
      <div className={css(tw`flex flex-wrap`)}>
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
      </div>
      <Divider />
      <div className={css(tw`flex flex-wrap`)}>
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
