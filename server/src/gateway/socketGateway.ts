import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private deviceConnectSockets = new Map<string, string>()

    handleConnection(socket: Socket) {
        console.log(`[WS] client ${socket.id} connect to server success!`)
    }

    handleDisconnect(socket: Socket) {
        for (const [deviceId, socketId] of this.deviceConnectSockets.entries()) {
            if (socketId === socket.id) {
                this.deviceConnectSockets.delete(deviceId)
                break
            }
        }

        console.log(`[WS] client ${socket.id} disconnect from server success!`)
    }

    @SubscribeMessage('raspberry_connect')
    handleRegisterRaspberryConnectTo(
        @MessageBody() data: { device_code: string },
        @ConnectedSocket() socket: Socket,
    ) {
        console.log(`[WS] device ${data.device_code} register connect (socket ${socket.id})`)
        this.deviceConnectSockets.set(data.device_code, socket.id)
    }

    emitNewConfigurationToRaspberry(device_code: string, config: any) {
        const socketId = this.deviceConnectSockets.get(device_code)

        if (socketId) {
            this.server.to(socketId).emit('new_config', config)
            console.log(`[WS] Sent new configuration to raspberry ${device_code}`)
        } else {
            console.warn(`[WS] Can not find raspberry ${device_code}. Please try again...`)
        }
    }

    emitNewFruitClassification(data: any) {
        this.server.emit('newFruitClassification', data);
    }
}