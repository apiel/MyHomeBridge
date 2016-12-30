import fs = require('fs');
import path = require('path');

export class Model <T> {
    filePath: string;
    data: T;
    
    constructor(filePath: string) {
        this.filePath = path.dirname(require.main.filename) + filePath;
    }
    
    get(): T {
        if (typeof this.data === 'undefined') {
            this.load();
        }
        return this.data;
    }
    
    set(data: T): Model<T> {
        this.data = data;
        return this;
    }    
        
    load(): Model<T> {
        console.log("Load model.");
        if (fs.existsSync(this.filePath)) {
            this.data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
        }
        else {
            throw 'Path to data model folder does not exist: ' + this.filePath;
        } 
        return this;       
    }
    
    save(): Model<T> {
        console.log("Save model.");
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 4), 'utf8');
        return this;
    }
}

export class ModelObject <T> extends Model <T[]> {
    getById(id: string): T {
        let item: T = this.get()[<any>id];
        if (typeof item === 'undefined') {
            throw "Unknown item key";
        }        
        return item;
    }  
    
    add(id: string, object: T): ModelObject <T> {
        this.get()[<any>id] = object;
        return this;
    }  
}