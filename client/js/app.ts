import { SocketService } from "./shared/socket.service";

class App{
    private msg: string;
    private socketService: SocketService;
    constructor(){
        this.socketService = new SocketService();
        this.msg = "some application code";
    }

    public main(){
        console.log(this.msg);
        this.socketService.sendMessage("azaza");
    }
}

let app: App = new App();
app.main();
