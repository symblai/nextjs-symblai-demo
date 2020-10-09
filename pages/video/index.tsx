import { useState, useEffect, useRef } from 'react'
import { css } from '@emotion/css'
import tw from '@tailwindcssinjs/macro'
import {
  TypingIntro,
  FileOrUrlInput,
  FileOrUrlInputSubmitType,
  Divider,
  FlexWrap,
  Card,
  Link,
  ProtectedPage,
  JsonPayloadCard,
  ConversationCard,
  VideoMessages,
} from '../../components'
import { Transcripts, Topics } from '@symblai/react-elements'
import { useConnection, useAuth, useConversation } from '../../hooks'

const useAsyncVideoApi = (data: File | string | undefined) => {
  const { token } = useAuth()
  const { conversationData, setConversationData } = useConversation()
  const [sentForProcessing, setSentForProcessing] = useState(false)
  const [jobStatus, setJobStatus] = useState(null)
  useEffect(() => {
    const controller = new AbortController()

    const isFile = data instanceof File

    async function fetchData() {
      const urlVideo = isFile
        ? 'https://api.symbl.ai/v1/process/video'
        : 'https://api.symbl.ai/v1/process/video/url'
      const requestOptions = {
        method: 'GET',
        headers: {
          'x-api-key': token,
        },
      }
      async function getFileOrUrlOptions() {
        if (isFile) {
          const file = data
          const requestOptionsVideo = {
            method: 'POST',
            headers: {
              'x-api-key': token,
              'Content-Type': 'video/mp4',
            },
            body: file,
            json: true,
          }
          return requestOptionsVideo
        } else {
          const url = data
          const requestOptionsVideo = await {
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
          return requestOptionsVideo
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
          const requestOptionsVideo = await getFileOrUrlOptions()
          const processingResponse = await fetch(urlVideo, requestOptionsVideo)
          console.log(processingResponse)
          const processingResponseJson = await processingResponse.json()
          console.log(processingResponseJson)
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

const Index = () => {
  const [connectionId] = useConnection()
  const { conversationData, setConversationData } = useConversation()
  const [playbackTime, setPlaybackTime] = useState(0)
  const [file, setFile] = useState('')
  const [videoSrc, setVideoSrc] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const { jobStatus, sentForProcessing } = useAsyncVideoApi(
    videoUrl !== '' ? videoUrl : file
  )

  const videoRef = useRef<HTMLVideoElement>(null)

  const setMediaTime = (_newTime: any) => {
    console.log('setting Time ', _newTime)
    if (_newTime && typeof _newTime === 'number') {
      const videoElement = videoRef.current as HTMLVideoElement
      videoElement.currentTime = _newTime
      setPlaybackTime(_newTime)
    }
  }

  const shouldRenderInput =
    (jobStatus as any)?.status !== 'in_progress' &&
    !jobStatus &&
    !sentForProcessing

  const caption =
    sentForProcessing && !jobStatus
      ? 'Sending...'
      : jobStatus && (jobStatus as any).status === 'in_progress'
      ? `Processing with Symbl...`
      : 'Processed and ready'

  useEffect(() => {
    const src = URL.createObjectURL(new Blob([file], { type: 'video/mp4' }))
    setVideoSrc(src)
  }, [file])

  useEffect(() => {
    setVideoSrc(videoUrl)
  }, [videoUrl])

  const onVideoSubmit = async (data: FileOrUrlInputSubmitType) => {
    setConversationData(null)
    if (data.type === 'file') {
      setFile(data?.file as any)
    } else {
      setVideoUrl(data?.url as string)
    }
  }

  return (
    <ProtectedPage>
      <TypingIntro>
        This page uses Video Async API. Upload the video or provide a url to get
        insights
      </TypingIntro>
      <Link href="https://docs.symbl.ai/#video-api">
        You can also process video files or urls with Symbl and get insights.
        You can check out the docs on more API info. Make sure to also check out
        the Transcription component where you can click on individual
        transcriptions and get to specific point in the video, where the phrase
        was said
      </Link>
      <Divider />
      {connectionId ? (
        <label
          className={css(tw`text-indigo-300`)}
        >{`connectionId ${connectionId}`}</label>
      ) : null}
      {shouldRenderInput ? (
        <FileOrUrlInput onSubmit={onVideoSubmit} />
      ) : (
        <div className={css(tw`text-blue-400 p-2`)}>{caption}</div>
      )}
      <FlexWrap>
        <video
          id="video-summary"
          autoPlay
          ref={videoRef}
          controls
          src={videoSrc}
          className={css(tw`w-1/2`)}
        />
        <VideoMessages setPlaybackTime={setMediaTime} />
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
