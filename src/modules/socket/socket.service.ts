import { Injectable } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class SocketService {
  @WebSocketServer()
  server: Server

  private adminSockets: Map<string, Socket> = new Map()

  addAdminSocket(clientId: string, socket: Socket) {
    this.adminSockets.set(clientId, socket)
  }

  removeSocket(clientId: string) {
    this.adminSockets.delete(clientId)
  }

  emitToAdmins(event: string, data: any) {
    console.log('emitToAdmins', event, data)
    this.adminSockets.forEach((socket) => {
      console.log('socket.id', socket.id)
      socket.emit(event, data)
    })
  }

  emit(event: string, data: any) {
    this.server.emit(event, data)
  }

  isAdmin(socket: Socket): boolean {
    return socket.handshake.query.isAdmin === 'true'
  }
}
