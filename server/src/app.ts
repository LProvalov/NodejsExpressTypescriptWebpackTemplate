import { Server } from "./server";
import * as http from "http";
var path = require('path');
global['appRoot'] = path.resolve(__dirname);
global['publicRoot'] = path.resolve(__dirname) + "/../public";

class App{
    private server: Server;
    private httpServer: http.Server;
    private httpPort: any

    constructor(){
        this.httpPort = this.normalizePort(process.env.PORT || 3000);
        this.server = Server.bootstrap();
    }

    public main(){        
        var app = Server.bootstrap().app;
        app.set("port", this.httpPort);
        app.set('view engine', 'html');
        this.httpServer = http.createServer(app);
        this.httpServer.listen(this.httpPort);
        this.httpServer.on("error", this.onError);
        this.httpServer.on("listening", this.onListening.bind(this));
    }

    public normalizePort(val: string) : any {
        var port = parseInt(val, 10);
        if (isNaN(port)) { return val; }
        if (port >= 0) { return port; }
        return false;
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
        var address: { port: number; family: string; address: string; } = this.httpServer.address();
        var bind = typeof(address) === "string" 
            ? "pipe " + address
            : "port " + address.port
    }
}

var app: App = new App();
app.main();