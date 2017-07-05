import * as http from "http";
import * as socketIo from "socket.io";
import * as url from 'url';
import { UserModel } from './../models/user';

export class BaseSocketServer {
    public static create(socket: SocketIO.Socket, io: SocketIO.Server){
        socket.on("message", (msg: String)=>{
            new BaseSocketServer().messageHandler(msg, io);
        });
    }

    constructor(){
        
    }

    private messageHandler(msg: String, io: SocketIO.Server){
        console.log("server resive msg: " + msg);
        io.emit("message", msg);
    }
}