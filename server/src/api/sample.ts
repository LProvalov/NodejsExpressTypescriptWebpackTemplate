import { Application, Request, Response } from "express";
import { ApiBase } from "./apiBase";

export class SampleApi extends ApiBase{
    
    public static create(app: Application){
        app.get(ApiBase.apiUrl + '/sampleGet', (req: Request, res: Response) =>{
            new SampleApi().sampleGet(req, res);
        } );
    }

    constructor(){
        super();
    }

    protected sampleGet(req: Request, res: Response){
        res.send('this is simple response from API: ' + Date.now());
    }
}