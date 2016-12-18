import fs = require('fs');
import path = require('path');

export default class <T> {
    filePath: string;
    data: T[];
    
    constructor(filePath: string) {
        this.filePath = path.dirname(require.main.filename) + filePath;
        this.load();
    }
    
    all(): T[] {
        return this.data;
    }
    
    get(id: string): T {
        let item: T = this.data[<any>id];
         if (!item) {
            throw "Unknown item key";
        }        
        return item;
    }
    
    load() {
        console.log("Load model.");
        if (fs.existsSync(this.filePath)) {
            this.data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
        }
        else {
            throw 'Path to data model folder does not exist: ' + this.filePath;
        }        
    }
    
    save() {
        console.log("Save model.");
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 4), 'utf8');
    }
}