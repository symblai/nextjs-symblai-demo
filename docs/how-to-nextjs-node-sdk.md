## Introduction

In this How to guide, we will see how we can use Symbl node sdk to call on the phone or meeting url and get live transcription in NextJS app, particularly on the server side. Symbl comes with REST api, so same thing we can get by calling specific endpoint on the client side, but there are some use cases that you would want to use particularly server side.For example if you want to do some business logic decisions based on the data received from symbl.

The main flow that we want to achieve is that you can enter your phone number in UI and hit on ![](./imgs/call.png) button.

This is how the UI of the demo app will look like:

![text page screenshot](./imgs/nodeui.png)

In addition to phone number, you can actually select whether you want to use Public Switched Telephony Networks (PSTN) or Session Initaition Protocol (SIP). You will be also able to add advanced params such as DTMF code or Summary email, where to send insights summary once conversation is finished

## Get Started

We won't dive into all details of implementing NextJS app from scratch, so you always can check the [demo app code](https://github.com/symblai/nextjs-symblai-demo) for more info. Also feel free to open issues asking questions or writing suggestions.

#### Retrieve your credentials

In order to use Symbl API, you need to sign up and get your credentials. They include your `appId` and `appSecret`. You can find them on the home page of the platform.

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

In order to see demo app in action, you can clone the repo, run `yarn` and then `yarn dev`.

Page you are looking for this tutorial is `/` or this [file](https://github.com/symblai/nextjs-symblai-demo/blob/master/pages/index.tsx)

## Create NextJS API routes

Let's create `/api/call.ts` file which will be our api endpoint. We will use it both for calling to our phone or ending the call.

NextJS API endpoints will reside under `pages/api` and will have the following structure

```javascript
export default (req: any, res: any) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  const params = JSON.parse(req.body)
  res.end(params)
}
```

we will get bunch of params that we will pass from the client and will pass to Symbl node sdk. One of such params will be `start` param.

```javascript
export default (req: any, res: any) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  const {
    phoneNumber,
    dtmf,
    type,
    summaryEmails,
    start,
    connectionId,
    insightTypes,
  } = JSON.parse(req.body)

  if (start) {
    console.log('Calling ', phoneNumber)
    startEndpoint(
      { phoneNumber, dtmf, type, summaryEmails, insightTypes },
      onSpeechDetected
    ).then((connectionId: string) => {
      console.log('Connection Started', connectionId)
      res.end(JSON.stringify({ connectionId }))
    })
  } else {
    if (connectionId) {
      console.log('Connection Stopped', connectionId)
      stopEndpoint(connectionId).then((connection) => {
        res.end(JSON.stringify(connection))
      })
    }
  }
}
```

We will use `start` and `connectionId` parameters to determine whether we are starting or ending the call.

Basically what happens is every time we start the call, we will get back the `connectionId` from Symbl, that we will pass to the client. Then later if we want to end the call, we need to pass this `connectionId` along with `start: false` to end the call.

### Using Symbl Node SDK

If you look at the code the most dominant part will be this one:

```javascript
startEndpoint(
  { phoneNumber, dtmf, type, summaryEmails, insightTypes },
  onSpeechDetected
)
```

That is actually a function that we will write, which will pass parameters to symbl node sdk and trigger `onSpeechDetected` callback. This callback can be your custom business logic, but in our case we will simply log the response.

```typescript
async function onSpeechDetected(data: any) {
  const { type } = data
  console.log('Response type:', type)
}
```

### Symbl integration

Let's create a file called `integrations/symbl/utils.ts` and create `startEndpoint` and `stopEndpoint` functions, but before we need to initialize our sdk

#### Initializing sdk

```javascript
const sdkInit = async () => {
  await sdk.init({
    appId: process.env.APP_ID,
    appSecret: process.env.APP_SECRET,
    basePath: apiBase,
  })
}
```

We are using `.env` file in this app, so we need to add our `APP_ID` and `APP_SECRET` there.

### `startEndpoint`

`startEndpoint` will get several parameters from the client:

- `type` - Symbl supports two meetings types. `PSTN` and `SIP`
- `phoneNumber` - Naturally we need to have a phone number to call, but in case of `SIP` type we will need to call url. Something like `sip:124@domain.com`. For simplicity we will pass this data under `phoneNumber` parameter.
- `dtmf` - This will be meeting code, which we need to pass in case meeting has such a code
- `summaryEmail` - you can pass a list of emails which will get summary of the call email.
- `insightTypes` - there are several insight types that we can pass to Symbl.

```javascript
export const startEndpoint = async (
  {
    type,
    phoneNumber,
    dtmf,
    summaryEmails,
    insightTypes,
  }: {
    type: string
    phoneNumber: string
    dtmf: string
    summaryEmails: string
    insightTypes: string
  },
  callback: (data: any) => Promise<void>,
  endCallAfterInSeconds = 300
): Promise<any> => {
  //init our sdk
  await sdkInit()
}
```

### Usyng Symbl Node SDK

Now let's import `symbl-node`
`import { sdk } from 'symbl-node'`

And use `startEndpoint` method by passing all the parameters we've got from the client.

```javascript
const phoneNumberOrUri = type === 'sip' ? { uri: phoneNumber } : { phoneNumber }
const connection = await sdk.startEndpoint(
  {
    endpoint: {
      type,
      ...phoneNumberOrUri,
      dtmf,
    },
    intents,
    insightTypes,
    actions: [
      {
        invokeOn: 'stop',
        name: 'sendSummaryEmail',
        parameters: {
          emails: summaryEmails.split(','),
        },
      },
    ],
    data: {
      session: {
        name: `Live Intent Detection NextJS demo - ${phoneNumber}`,
      },
    },
  },
  callback
)
```

You can see here in the code, that we either pass `phoneNumber` or `uri`, based on whether we have `SIP` or `PSTN` configuration

When executing this function we will initiate the call and tell Symbl to analyse it. What will be returned is `connectionId` in which we will be particalarly interested for both subscribing to events and stopping our call.

### `stopEndpoint`

This function will get `connectionId` and call `sdk.stopEndpoint` function to stop the connection.

```typescript
const stopEndpoint = async (connectionId: string) => {
  console.log('Stopping connection for ' + connectionId)

  try {
    const connection = await sdk.stopEndpoint({
      connectionId,
    })

    console.log('Summary Info:', connection.summaryInfo)
    console.log('Conversation ID:', connection.conversationId)

    return {
      summaryInfo: connection.summaryInfo,
      conversationId: connection.conversationId,
    }
  } catch (e) {
    console.error('Error while stopping the connection.', e)
    throw e
  }
}
```

### Subscribe to events from NextJS API route

Now we want to create an endpoint that we can call to subscribe for realtime events. For our example we will use `socket.io` library to use websockets and emit changes from the server to the client.

Let's create a new endpoint by creating a file `/api/subscribeToPhoneEvents.ts`

We will use `Socket.io` specific setup within our handler

```javascript
if (!res.socket.server.io) {
  const io = new Server(res.socket.server)
  io.on('connection', (socket: any) => {
    socket.on('subscribeToEvents', (msg: any) => {
      subscribeToRealtimeEvents(msg.connectionId, (data) => {
        socket.emit('realtimeEvent', data)
      })
    })
    socket.on('endCall', (msg: any) => {
      stopEndpoint(msg.connectionId)
    })
  })

  res.socket.server.io = io
} else {
  console.log('socket.io already running')
}
res.end()
```

So what we are doing here?

- Starting socket.io server if it doesn't exist `const io = new Server(res.socket.server)`
- When client is connected, we initiate subscription:

```javascript
socket.on('subscribeToEvents', (msg: any) => {
  subscribeToRealtimeEvents(msg.connectionId, (data) => {
    socket.emit('realtimeEvent', data)
  })
})
```

Here we basically pass `connectionId` that was created after our call to telephony API to helper function `subscribeToRealtimeEvents`. We also pass a callback to trigger `realtimeEvent` that will push the event and the data from the server to client via websockets.

### Subscribing to Symbl realtime events

To subscribe to realtime events, we will create another helper function under `integrations/symbl/utils.ts`

```javascript
export async function subscribeToRealtimeEvents(
  connectionId: string,
  handler: (data: any) => void
) {
  console.log(`Subscribe to events of connection: ${connectionId}`)
  await sdkInit()
  sdk.subscribeToConnection(connectionId, handler)
}
```

Here we will instantiate sdk and call `subscribeToConnection` method within NodeSDK.

### Server side summary

At this point we both have `/api/call` api route to initiate the call and `api/subscribeToPhoneEvents` to subscribe to events using `socket.io`

## Client side setup

In order to set up our client properly we need two parts.

1. Creating `PhoneConfigurations` component - we won't dive into this React component, but the main idea of it is to get user input for the following parameters and call `/api/call` endpoint with these params.

```javascript
const params = {
  type,
  phoneNumber,
  dtmf,
  summaryEmails,
  insightTypes,
}
```

2. Subscribing based on `connectionId`.
   We've seen already that we are getting back `connectionId` from `api/call` endpoint, so in order to subscribe to real time events we will use this:

```javascript
useEffect(() => {
  console.log('Connection Id:', connectionId)
  if (connectionId) {
    fetch('/api/subscribeToPhoneEvents', {
      method: 'POST',
    }).finally(() => {
      socket = io()
      socket.on('connect', () => {
        console.log('connect')
        socket.emit('subscribeToEvents', { connectionId })
      })

      socket.on('realtimeEvent', (data: any) => {
        console.log('Real time event', data)
        if (data.type === 'transcript_response') {
          setLiveTranscript(data.payload.content)
        }
        if (data.type === 'message_response') {
          const oldMsgs = messagesList.current
          setMessages([...oldMsgs, ...data.messages])
        }
        if (data.type === 'insight_response') {
          const oldInsights = insightsList.current
          setInsights([...oldInsights, ...data.insights])
        }
      })

      socket.on('disconnect', () => {
        console.log('disconnect')
      })
    })
  }
}, [connectionId])
```

As you can see in the code, we set different state variables based on different responses we are getting from socket.io `realtimeEvent` message.

Response that we will get will be either `transcript_response` type or `message_response` type or `insight_response` type. For example `message_response` will look like this:

```json
{
  "type": "message_response",
  "messages": [
    {
      "from": {},
      "payload": {
        "content": "Yeah, tell us sir.",
        "contentType": "text/plain"
      },
      "duration": {
        "startTime": "2020-10-22T15:32:14.500Z",
        "endTime": "2020-10-22T15:32:16.000Z"
      }
    }
  ]
}
```

Now what is left is to render UI based on what data we get.

## Summary

In this How To we've briefly walked you through the key points and flows that should be implemented in order to use Symbl Node SDK to use Telephony API and start a phone call and subscribe to real time updates. It's up to you how to bring this data from the server to the client and even though in this example we've used socket.io to push the data from server to client, it's up to you what and how to implement passing data from server to client.
Even though the code shared in this How To is React specific, The NodeJS call in generic enough to use it with any UI framework.

You can read more about Node SDK [here](https://docs.symbl.ai/#symbl-sdk-node-js)
