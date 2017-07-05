import { Application, Request, Response } from "express";
import { ApiBase } from "./apiBase";
import { UserModel } from "./../models/user";

export class UsersApi extends ApiBase {
    public static create(app: Application){
        app.get(ApiBase.apiUrl + '/users/list', (req: Request, res: Response) => {
            new UsersApi().getUsersList(req, res);
        });

        app.post(ApiBase.apiUrl + '/users/create', (req: Request, res: Response) => {
            new UsersApi().createUser(req, res);
        });

        app.get(ApiBase.apiUrl + '/users/find', (req: Request, res: Response) => {
            new UsersApi().findUser(req, res);
        });
    }

    constructor(){
        super();
    }

    protected getUsersList(req: Request, res: Response){
        console.log('getUsersList request');
        UserModel.getAllUsers().then(
            (users) => {
                res.json(users);
            },
            (reason) => {
                res.json(reason);
            }
        );
    }

    protected createUser(req: Request, res: Response){
        let username: string = req.body.username;
        let password: string = req.body.password;

        console.log('createUser request ' + username + ' ' + password);
        if(username === undefined || password === undefined) {
            res.send("User can't be created.");
            return;
        }
        UserModel.createUser(username, password).then(
            (user) => {
                res.send("User created successfully");
            }, 
            (reason) =>{
                res.json(reason);
            }
        );
    }

    protected findUser(req: Request, res: Response){
        let username: string = req.body.username;
        console.log('findUser request ' + username);
        UserModel.findUser(username).then(user => {
            if(user){
                res.json({ user });
            } else {
                res.send("can't find this user");
            }
        });
    }
}