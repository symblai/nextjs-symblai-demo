## Get Started

#### Retrieve your credentials

Your credentials include your appId and appSecret. You can find them on the home page of the platform.

![](https://docs.symbl.ai/images/credentials-faf6f434.png)

add credentials to `next-config.js` file filling in `APP_ID` and `APP_SECRET` variables.

```javascript
module.exports = {
  env: {
    APP_ID: '',
    APP_SECRET: '',
  },
}
```

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

### Using Symbl Text Async API

The Async Text API allows you to process any text payload to get the transcription and conversational insights. It can be useful in any use case where you have access to the textual content of a type of conversation, and you want to extract the insightful items supported by the Conversation API. If you want to add more content to the same conversation, use [PUT Async Text API](https://docs.symbl.ai/#text-api).

Symbl Text async API will return `jobId` which we can monitor for completion by using polling mechanism. Once job is completed, we will get `conversationId` which we can use to retrieve data with Conversation API.

#### Text upload and processing

Text async API is built for particular format of messages list that you can upload and parse to get conversational insights. The format should look something like that:

```json
[
  {
    "payload": {
      "content": "Hi Mike, Natalia here. Hope you don’t mind me reaching out. Who would be the best possible person to discuss internships and student recruitment at ABC Corp? Would you mind pointing me toward the right person and the best way to reach them? Thanks in advance for your help, I really appreciate it!"
    },
    "from": {
      "userId": "natalia@example.com",
      "name": "Natalia"
    },
    "duration": {
      "startTime": "2020-07-21T16:02:19.01Z",
      "endTime": "2020-07-21T16:04:19.99Z"
    }
  },
  {
    "payload": {
      "content": "Hey Natalia, thanks for reaching out. I am connecting you with Steve who handles recruitements for us."
    },
    "from": {
      "userId": "mike@abccorp.com",
      "name": "Mike"
    },
    "duration": {
      "startTime": "2020-07-21T16:04:19.99Z",
      "endTime": "2020-07-21T16:04:20.99Z"
    }
  }
]
```

So we will have a textarea on the page where you can paste you content. Then in order to process it, you need to click `Submit for processing` button.
For convenience we will also have "chat like" UI which we can use to build the json in the format mentioned above and submit it for processing.

Once you do that, there are several things that happen

#### 1. Get Relevant params for Video URL or file

You will see the following params defined within `useEffect`

```typescript
const requestTextOptions = {
  method: 'POST',
  headers: {
    'x-api-key': token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: JSON.parse(data),
  }),
}

const requestOptions = {
  method: 'GET',
  headers: {
    'x-api-key': token,
  },
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
// Execute the request
const processingResponse = await fetch(
  'https://api.symbl.ai/v1/process/text',
  requestTextOptions
)
const processingResponseJson = await processingResponse.json()
// Check Job Status
check(processingResponseJson.jobId)
```

After Job is finished we can get data from Conversation API. We will do that by using `<ConversationCard/>`component.

On this page you will also see this component `<Transcripts conversationId={conversationData.conversationId} />`

This is prebuilt component from `@symblai/react-elements` package. As soon as you provide it with `conversationId`, It will nicely render conversation transcripts. There is also `<Topics conversationId={conversationData.conversationId}/>` component that will do the same but for topics.
