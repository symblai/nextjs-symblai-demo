import { startEndpoint, stopEndpoint } from '../../integrations/symbl/utils'

async function onSpeechDetected(data: any) {
  const { type } = data
  console.log('Response type:', type)
}

export default (req: any, res: any) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  const { phoneNumber, start, connectionId, insightTypes } = JSON.parse(
    req.body
  )

  if (start) {
    console.log('Calling ', phoneNumber)
    startEndpoint(phoneNumber, insightTypes, onSpeechDetected).then(
      (connectionId: string) => {
        console.log('Connection Started', connectionId)
        res.end(JSON.stringify({ connectionId }))
      }
    )
  } else {
    if (connectionId) {
      console.log('Connection Stopped', connectionId)
      stopEndpoint(connectionId).then((connection) => {
        res.end(JSON.stringify(connection))
      })
    }
  }
}
