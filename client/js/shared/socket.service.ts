import * as socketIo from "socket.io-client";

let SERVICE_URL = "http://localhost:3000";

export class SocketService {
    private socket: any;

    constructor(){
        this.initSocket();
    }

    private initSocket(){
        this.socket = new socketIo(SERVICE_URL);
    }

    public sendMessage(message: String){
        this.socket.emit('message', message);
    }
};