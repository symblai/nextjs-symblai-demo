import { useState, createContext, useContext, useEffect } from 'react'

export const ConnectionContext = createContext<any>(null)
export const ConversationContext = createContext<any>(null)
export const AuthContext = createContext<any>(null)

export const ConnectionProvider: React.FC = ({ children }) => {
  const [id, setId] = useState(null)
  const [token, setToken] = useState(null)
  const [conversationData, setConversationData] = useState(null)
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <ConnectionContext.Provider value={[id, setId]}>
        <ConversationContext.Provider
          value={{ conversationData, setConversationData }}
        >
          {children}
        </ConversationContext.Provider>
      </ConnectionContext.Provider>
    </AuthContext.Provider>
  )
}

export const useConnection = () => useContext(ConnectionContext)
export const useConversation = () => useContext(ConversationContext)
export const useAuth = () => useContext(AuthContext)

const MIME_TYPES = {
  mp3: 'audio/mpeg',
  wav: 'audio/wave',
}

export function useAudioAsyncAPI(
  data: File | string | undefined,
  query: string
) {
  const { token } = useAuth()
  const { conversationData, setConversationData } = useConversation()
  const [sentForProcessing, setSentForProcessing] = useState(false)
  const [jobStatus, setJobStatus] = useState(null)
  useEffect(() => {
    const isFile = data instanceof File

    async function fetchData() {
      const urlAudio = isFile
        ? `https://api.symbl.ai/v1/process/audio${query}`
        : `https://api.symbl.ai/v1/process/audio/url${query}`
      const requestOptions = {
        method: 'GET',
        headers: {
          'x-api-key': token,
        },
      }
      async function getFileOrUrlOptions() {
        if (isFile) {
          const file = data
          const requestOptionsAudio = {
            method: 'POST',
            headers: {
              'x-api-key': token,
              'Content-Type': MIME_TYPES['mp3'],
            },
            body: file,
          }
          return requestOptionsAudio
        } else {
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
  }, [data, conversationData, setConversationData])

  return {
    jobStatus,
    setJobStatus,
    sentForProcessing,
  }
}

export function useMessages() {
  const [data, setData] = useState<any[]>()
  const { token } = useAuth()
  function fetchData(id: string) {
    const url = `https://api.symbl.ai/v1/conversations/${id}/messages`
    const requestOptions = {
      method: 'GET',
      headers: {
        'x-api-key': token,
      },
    }
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        let startTime: any
        let endTime
        let item
        console.log('Messages', data)
        if (data.messages && data.messages.length > 0) {
          startTime = new Date(data.messages[0].startTime).getTime()
          item = data.messages.map((item: any) => [
            item.id,
            item.text,
            /* message start time relative to content */ (new Date(
              item.startTime
            ).getTime() -
              startTime) /
              1000,
            /* message end time relative to content */ (new Date(
              item.endTime
            ).getTime() -
              startTime) /
              1000,
          ])
        } else {
          item = data.messages.map((item: any) => [item.id, item.text, -1, -1])
        }
        setData(item)
      })
  }
  return {
    fetchData,
    data,
  }
}

export const useTextAsyncAPI = (data: string) => {
  const { token } = useAuth()
  const { conversationData, setConversationData } = useConversation()
  const [sentForProcessing, setSentForProcessing] = useState(false)
  const [jobStatus, setJobStatus] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const requestTextOptions = {
        method: 'POST',
        headers: {
          'x-api-key': token,
          'Content-Type': 'application/json',
        },
        body: data,
      }

      const requestOptions = {
        method: 'GET',
        headers: {
          'x-api-key': token,
        },
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
          const processingResponse = await fetch(
            'https://api.symbl.ai/v1/process/text',
            requestTextOptions
          )
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
  }, [data, conversationData, setConversationData])

  return {
    jobStatus,
    setJobStatus,
    sentForProcessing,
  }
}

export const useAsyncVideoApi = (
  data: File | string | undefined,
  query: string
) => {
  const { token } = useAuth()
  const { conversationData, setConversationData } = useConversation()
  const [sentForProcessing, setSentForProcessing] = useState(false)
  const [jobStatus, setJobStatus] = useState(null)
  useEffect(() => {
    const isFile = data instanceof File

    async function fetchData() {
      const urlVideo = isFile
        ? `https://api.symbl.ai/v1/process/video${query}`
        : `https://api.symbl.ai/v1/process/video/url${query}`
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
  }, [data, conversationData, setConversationData])

  return {
    jobStatus,
    setJobStatus,
    sentForProcessing,
  }
}

export const useAsyncApiParams = () => {
  const [customVocabulary, setCustomVocabulary] = useState('')
  const [
    detectActionPhraseForMessages,
    setDetectActionPhraseForMessages,
  ] = useState(false)
  const [enableSpeakerDiarization, setEnableSpeakerDiarization] = useState(
    false
  )
  const [diarizationSpeakerCount, setDiarizationSpeakerCount] = useState(1)
  let query = enableSpeakerDiarization
    ? `?enableSpeakerDiarization=true&diarizationSpeakerCount=${diarizationSpeakerCount}&customVocabulary=${customVocabulary}`
    : ''

  query =
    query && detectActionPhraseForMessages
      ? query + '&detectActionPhraseForMessages=true'
      : detectActionPhraseForMessages
      ? '?detectActionPhraseForMessages=true'
      : query

  return {
    query,
    customVocabulary,
    setCustomVocabulary,
    enableSpeakerDiarization,
    setEnableSpeakerDiarization,
    diarizationSpeakerCount,
    setDiarizationSpeakerCount,
    setDetectActionPhraseForMessages,
  }
}
