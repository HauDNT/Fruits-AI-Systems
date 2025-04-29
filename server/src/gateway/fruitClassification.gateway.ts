import {
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class FruitClassificationGateway {
    @WebSocketServer()
    server: Server;

    broadcastNewClassification(data: any) {
        this.server.emit('newFruitClassification', data);
    }
}