## Get Started

#### Retrieve your credentials

Your credentials include your appId and appSecret. You can find them on the home page of the platform.

![](https://docs.symbl.ai/images/credentials-faf6f434.png)

add credentials to `.env` file filling in `APP_ID` and `APP_SECRET` variables.

### Authenticating

When using REST API, we would need to pass auth token in header. For that we've created component `ProtectedPage`. This component executes Symbl specific REST endpoint, to retrieve auth token and store it in context. Later on we can retrieve this token from the helper hook `useAuth`

This is how we would retrieve the token:

```javascript
async function loginToSymbl() {
    const response = await fetch('https://api.symbl.ai/oauth2/token:generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        type: 'application',
        appId: process.env.APP_ID,
        appSecret: process.env.APP_SECRET,
      }),
    })
    const json = await response.json()
    console.log('Access Token is: ', json)
    setToken(json.accessToken)
```

Later on in any place in application we can use `const { token } = useAuth()` to get the token.

### Using Symbl audio Async API

Symbl Audio async API is used to process audio file or url and return `jobId` which we can monitor for completion by using polling mechanism. Once job is completed, we will get `conversationId` which we can use to retrieve data with Conversation API.

#### File Upload and processing.

If you look at `pages/audio/index.tsx` file, you will notice that for file upload we are using

```typescript
<FileOrUrlInput onSubmit={onAudioSubmit} />
```

We won't dive into how it's implemented but basically the idea is to toggle between URL or file input. Once you click on the button with caption `Submit for processing`, it will call `onAudioSubmit` function passing either URL or file.

```typescript
const onAudioSubmit = async (data: FileOrUrlInputSubmitType) => {
  if (data.type === 'file') {
    setFile(data?.file as any)
  } else {
    setAudioUrl(data?.url as string)
  }
}
```

This will set our state.
All the processing is done within `useAudioAsyncAPI` hook. This hook monitors the state change

```typescript
const { jobStatus, sentForProcessing } = useAudioAsyncAPI(
  audioUrl !== '' ? audioUrl : file,
  asyncApiParams.query
)
```

and based on file/url change will start the following flow

#### 1. Transcoding audio file

You will see the following function defined within `useEffect`

```typescript
async function transcodeFile(_file: File) {
  // tslint:disable-next-line
  const transcoder = new (Transcoder as any)()
  const transcodedFile = await transcoder.load(_file)
  return transcodedFile
}
```

We will also create a new `AbortController` to abort transcoding and also to send `controller.signal` to Symbl API

```javascript
const controller = new AbortController()
```

2. #### Get Request parameters for either file or url

We will also define a function to conditionally get different request parameters that we need to send in our REST call. After all there is a difference whether we send a file or URL

```typescript
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
```

3. #### Use Job API to poll for job status.

Previously we mentioned that there should be some kind of polling mechanism to check whether the job is finished or not. Symbl has [Job API](https://docs.symbl.ai/#job-api) That we can use for that.

```typescript
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
```

So the flow will be:

```typescript
//Transcode and get Parameters
const requestOptionsAudio = await getFileOrUrlOptions()
// Execute the request
const processingResponse = await fetch(urlAudio, requestOptionsAudio)
const processingResponseJson = await processingResponse.json()
// Check Job Status
check(processingResponseJson.jobId)
```

After Job is finished we can get data from Conversation API. We will do that by using `<ConversationCard/>`component.

On this page you will also see this component `<Transcripts conversationId={conversationData.conversationId} />`

This is prebuilt component from `@symblai/react-elements` package. As soon as you provide it with `conversationId`, It will nicely render conversation transcripts. There is also `<Topics conversationId={conversationData.conversationId}/>` component that will do the same but for topics.

### Passing additional Async API parameters to get more granular insights
