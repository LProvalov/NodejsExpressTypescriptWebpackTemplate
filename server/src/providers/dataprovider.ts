import * as mongoose from "mongoose";

export class DataProvider{
    private bookSchema: mongoose.Schema;
    private dbUrl = 'mongodb://localhost/temp-dev';

    get BookSchema(){
        return this.bookSchema;
    }

    constructor(){
        this.createSchemas();        
        mongoose.model('Book', this.bookSchema);
        mongoose.connect(this.dbUrl);
    }

    private createSchemas(){

        this.bookSchema = new mongoose.Schema({
            title: String,
            author: String,
            category: String
        });

    }
}