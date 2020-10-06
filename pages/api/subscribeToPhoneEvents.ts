import Server from 'socket.io'
import {
  subscribeToRealtimeEvents,
  stopEndpoint,
} from '../../integrations/symbl/utils'
const ioHandler = (req: any, res: any) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server)
    io.on('connection', (socket: any) => {
      socket.on('subscribeToEvents', (msg: any) => {
        console.log(`Subscribe to realtime events of ${JSON.stringify(msg)}`)
        subscribeToRealtimeEvents(msg.connectionId, (data) => {
          socket.emit('realtimeEvent', data)
        })
      })
      socket.on('endCall', (msg: any) => {
        console.log('stopSubscription for the connection')
        stopEndpoint(msg.connectionId)
      })
    })

    res.socket.server.io = io
  } else {
    console.log('socket.io already running')
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default ioHandler
