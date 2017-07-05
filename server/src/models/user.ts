import * as mongoose from 'mongoose';
import { RepositoryBase } from './../providers/repositoryBase';

var Schema = mongoose.Schema;

export interface IUserModel extends mongoose.Document{
    name: string;
    password: string;
    createdAt: Date;
}

let _userSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: ""
    },
    password: {
        type: String,
        required: true,
        default: ""
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now()
    }
}).pre('save', function(next){
    if(this._doc){
        let doc = <IUserModel>this._doc;
        let now = new Date();
        if(!doc.createdAt){
            doc.createdAt = now;
        }
    }
    next();
    return this;
});

var _model = mongoose.model<IUserModel>('user', _userSchema, 'users', true);
export class UserRepository extends RepositoryBase<IUserModel> {
  constructor() {
    super(_model);
  }
}
Object.seal(UserRepository);

export class UserModel {
    private _document: IUserModel;

    static findUser(name: string) : Promise<IUserModel>{
        return new Promise<IUserModel>((resolve, reject) => {
            let repo = new UserRepository();
            repo.find({name: name}).exec((err, res) => {
                if(err) reject(err);
                else {
                    if(res.length) resolve(res[0]);
                    else resolve(null);
                }
            });
        });
    }

    static createUser(name: string, password: string): Promise<IUserModel>{
        return new Promise<IUserModel>((resolve, reject) =>{
            let repo = new UserRepository();
            let usermodel = <IUserModel>{
                name: name,
                password: password
            };
            repo.create(usermodel, (err, res) => {
                if(err) reject(err);
                else resolve(res);
            });
        });
    }

    static getAllUsers(): Promise<IUserModel[]>{
        return new Promise<IUserModel[]>((resolve, reject) => {
            let repo = new UserRepository();
            repo.find({}).exec((err, res) => {
                if(err) reject(err);
                else {
                    if(res.length) resolve(res);
                    else resolve(null);
                }
            });
        });
    }

    constructor(userModel: IUserModel){
        this._document = userModel;
    }

    get name(): string{
        return this._document.name;
    }

    get password(): string{
        return this._document.password;
    }

    get createdAt(): Date{
        return this._document.createdAt;
    }
}

Object.seal(UserModel);