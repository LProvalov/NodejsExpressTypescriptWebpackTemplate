import * as bodyParse from "body-parser";
import * as express from "express";
import * as async from "async";
import * as path from "path";
import errorHandler = require("errorhandler");

import { IndexRoute } from "./routes/index";

export class Server{
    public app: express.Application;

    public static bootstrap(): Server{
        return new Server();
    }

    constructor(){
        this.app = express();
        this.config();
        this.routes();
        this.api();
    }

    public api(){

    }

    public config(){
        this.app.use(express.static(global['publicRoot']));

        this.app.use(bodyParse.json());
        this.app.use(bodyParse.urlencoded({ extended: true }));

        this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction){
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
    }

    private routes(){
        let router: express.Router;
        router = express.Router();
        
        IndexRoute.create(router);

        this.app.use(router);
    }
}