import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
var path = require('path');

export class IndexRoute extends BaseRoute{
    public static create(router: Router){
        router.get("/", (req:Request, res:Response, next:NextFunction) =>{
            new IndexRoute().index(req, res, next);
        });
    }

    constructor(){
        super();
    }

    public index(req: Request, res:Response, next: NextFunction){
        this.title = "Index";

        let options: Object = {
            "message": "hello world"
        };

        res.sendFile(path.join(global['publicRoot'] + '/index.html'));
    }
}