import { useState, createContext, useContext, useEffect } from 'react'
import Transcoder from '../components/Transcoder'

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
          const file = data
          const transcodedFile: any = await transcodeFile(file as File)
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
