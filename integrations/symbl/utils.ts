import { apiBase, intents } from './config'
import { sdk } from 'symbl-node'

let stopEndpointTimeoutRef: any = null

const sdkInit = async () => {
  await sdk.init({
    appId: '387939426a786b70446a414638346e4a7a3636577339776e794637743458746e',
    appSecret:
      '3267345a79644577563533584a3478414932664148515663314570543265317245344c6f73674b4635334c626e7832775f5856634d67664d4a7770384a676371',
    basePath: apiBase,
  })
}

export const stopEndpoint = async (connectionId: string) => {
  console.log('Stopping connection for ' + connectionId)

  if (stopEndpointTimeoutRef) {
    clearTimeout(stopEndpointTimeoutRef)
    stopEndpointTimeoutRef = null
  }

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

export const startEndpoint = async (
  phoneNumber: string,
  callback: (data: any) => Promise<void>,
  endCallAfterInSeconds = 300
): Promise<any> => {
  try {
    await sdkInit()

    const connection = await sdk.startEndpoint(
      {
        endpoint: {
          type: 'pstn',
          phoneNumber,
        },
        intents,
        actions: [
          {
            invokeOn: 'stop',
            name: 'sendSummaryEmail',
            parameters: {
              emails: ['vnovick@gmail.com'],
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
    const connectionId = connection.connectionId
    console.log('Call established for connectionId: ' + connectionId)

    stopEndpointTimeoutRef = setTimeout(async () => {
      clearTimeout(stopEndpointTimeoutRef)
      stopEndpointTimeoutRef = null
      await stopEndpoint(connectionId)
    }, endCallAfterInSeconds * 1000)
    return connectionId
  } catch (e) {
    console.error('Error in establishing startEndpoint call with SDK', e)
    throw e
  }
}

export async function subscribeToRealtimeEvents(
  connectionId: string,
  handler: (data: any) => void
) {
  console.log(`Subscribe to events of connection: ${connectionId}`)
  await sdkInit()
  sdk.subscribeToConnection(connectionId, handler)
}
