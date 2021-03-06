import * as mongoose from "mongoose";
export let Schema = mongoose.Schema;
export let ObjectId = mongoose.Schema.Types.ObjectId;
export let Mixed = mongoose.Schema.Types.Mixed;

export interface IRead<T>{
    retrive: (
        callback: (error: any, result: any) => void
    ) => void;
    findById: (
        id: string,
        callback: (error: any, result: T) => void
    ) => void;
    findOne(
        cond?: Object,
        callback?: (error: any, result: T) => void
    ): mongoose.Query<T>,
    find(
        cond: Object,
        fields: Object,
        options: Object,
        callback?: (err: any, res: T[]) => void
    ): mongoose.Query<T[]>;
}

export interface IWrite<T>{
    create: (
        item: T,
        callback: (error: any, result: any) => void) => void;
    update: (
        _id: mongoose.Types.ObjectId, 
        item: T,
        callback: (error: any, result: any) => void) => void;
    delete: (
        _id: string,
        callback:(error: any, result: any) => void) => void;
}

export class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T>{
    private _model: mongoose.Model<mongoose.Document>;

    constructor(schemaModel: mongoose.Model<mongoose.Document>){
        let mongooseStat = mongoose.connection.readyState;
        console.log("Mongoose state: " + mongooseStat);
        if(mongooseStat != 1) throw "Error in mongoose connection!";
        this._model = schemaModel;
    }

    create(item: T, callback: (error: any, result: any) => void){
        this._model.create(item, callback);
    }

    update(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void){
        this._model.update({ _id: _id }, item, callback);
    }

    delete(_id: string, callback: (error: any, result: any) => void){
        this._model.remove({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
    }

    retrive(callback: (error: any, result: any) => void){
        this._model.find({}, callback);
    }

    findById(_id: string, callback: (error: any, result: T) => void){
        this._model.findById(_id, callback);
    }

    findOne(cond?: Object, callback?: (error: any, result: T) => void): mongoose.Query<T>{
        return this._model.findOne(cond, callback);
    }

    find(cond?: Object, fields?: Object, options?: Object,
        callback?: (err: any, res: T[]) => void): mongoose.Query<T[]>{
        return this._model.find(cond, options, callback);
    }

    private toObjectId(_id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(_id);
    }
}