import * as bodyParse from "body-parser";
import * as express from "express";
import * as async from "async";
import * as path from "path";
import * as http from "http";
import * as socketIo from "socket.io";
import * as mongoose from "mongoose";
import errorHandler = require("errorhandler");

import { IndexRoute } from "./routes/index";
import { SampleApi } from "./api/sample";
import { UsersApi } from "./api/users";
import { BaseSocketServer } from "./socket/socket";

export class Server{
    public app: express.Application;
    private httpPort: number;
    private io: SocketIO.Server;
    private httpServer: http.Server;
    private apiUrl: string = "/api";

    public static bootstrap(httpPort: any): Server{
        return new Server(httpPort);
    }

    constructor(httpPort: number){
        this.httpPort = httpPort;
        this.app = express();
        this.config();
        this.createHttpServer();
        this.routes();
        this.api();
        this.sockets();
    }

    private config(){
        this.app.use(express.static(global['publicRoot']));

        this.app.use(bodyParse.json());
        this.app.use(bodyParse.urlencoded({ extended: true }));

        this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction){
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());

        this.app.set("port", this.httpPort);
        this.app.set('view engine', 'html');

        let dbUrl = 'mongodb://localhost:27017/temp-dev';
        mongoose.connect(dbUrl, { "server": { "socketOptions": { "keepAlive": 1 }}});
    }

    private createHttpServer(){
        this.httpServer = http.createServer(this.app);
    }

    private routes(){
        let router: express.Router;
        router = express.Router();
        
        IndexRoute.create(router);

        this.app.use(router);
    }

    private api(){
        SampleApi.create(this.app);
        UsersApi.create(this.app);
    }

    private sockets(): void{
        this.io = socketIo(this.httpServer);
    }

    public listen(): void{
        this.httpServer.listen(this.httpPort, () => {
            console.log('Runing server on port %s', this.httpPort);
        });
        this.httpServer.on("error", this.onError);
        this.httpServer.on("listening", this.onListening.bind(this));  

        this.io.on('connect', (socket: SocketIO.Socket) => {
            console.log('Connected client on port %s', this.httpPort);

            BaseSocketServer.create(socket, this.io);

            socket.on('disconnect', ()=>{
                console.log('Client disconnected');
            });
        });        
    }

    protected onError(error: any){
        if(error.syscall !== "listen"){
            throw error;
        }
    
        var bind = typeof this.httpPort === "string"
                ? "Pipe " + this.httpPort
                : "Port " + this.httpPort; 
    
        switch(error.code){
            case "EACCES":
                console.error(bind + " request elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    protected onListening(){
        var address: { port: number; family: string; address: string; } = 
            this.httpServer.address();
        var bind = typeof(address) === "string" 
            ? "pipe " + address
            : "port " + address.port
    }
}