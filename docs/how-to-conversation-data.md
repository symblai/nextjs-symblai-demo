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

## Getting data from Conversation API

In order to get data from conversation API we will need to get **`conversationId`**. We can either use a demo id: `6055920157065216` or we can initiate the phone call using either Symbl Node SDK or Symbl REST api. Both flows will update `conversationId` parameter in the app and we will be able to retrieve data that we want.

In this demo app we have `<ConversationCard/>` component that will accept the following parameters:

```typescript
const ConversationCard = ({
  title,
  children,
  conversationId: cId,
  type,
}: {
  title: string
  conversationId: string
  children: JSX.Element
  type:
    | 'messages'
    | 'insights'
    | 'topics'
    | 'members'
    | 'questions'
    | 'follow-ups'
    | 'action-items'
}) => {}
```

This card component can render different data retrieved from Conversation API. The functionality is rather simple. Based on different types, card will render different data retrieved from Conversation API.

```typescript
const fetchData = async () => {
  const res = await fetch(`${CONVERSATION_API}/${conversationId}/${endpoint}`, {
    method: 'GET',
    headers: {
      'x-api-key': token as string,
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })

  const json = await res.json()
  setResponseData(json)
}
```

You can read more about conversation API [here](https://docs.symbl.ai/#conversation-api)
