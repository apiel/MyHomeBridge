import "babel-polyfill"; // find a solution to get rid of that
require('es6-promise').polyfill(); // find a solution to get rid of that

import * as request from 'request-promise';
//import { exec } from 'child_process';
//import { exec } from 'child-process-promise';
var exec = require('child-process-promise').exec;
import { ModelObject } from './../lib/model.helper';
import { Item, ItemAvailableStatus, ItemStatus, ItemDefinition, ItemBase } from './item';
// import { Observable, Observer } from 'rx';
import Events = require('events');

export default class {
    constructor(private itemModel: ModelObject<Item>, private eventEmitter: Events.EventEmitter) {}
        
    toggle(availableStatus: string[], status: string): string {
        for(let val of availableStatus) {
            if (!status) {
                status = val;
                break;
            }
            else if (status === val) {
                status = null;
            }
        }
        if (!status) {
            status = availableStatus[0];
        }
        return status;
    }    

    // we could make it async to have the same behavior as others
    // could be setStatus(itemStatus: ItemStatus)
    setStatus(id: string, status: string): ItemStatus { 
        console.log('SetStatus: ' + id + ' to ' + status);
        let item: Item = this.itemModel.getById(id);         
        if (item.type === "number") {
            this.setStatusOfTypeNumber(item, status);
        }
        else {
            this.setStatusOfTypeString(item, status);
        }
        this.itemModel.save();
        this.setStatusAction(item);   
        let itemStatus: ItemStatus = {id: id, status: item.status};
        this.eventEmitter.emit('set/item/status', itemStatus); 
        return itemStatus;
    }  

    async setStatusAsync(id: string, status: string) { 
        return this.setStatus(id, status);
    }
    
    execQueue: string[] = [];
    async consumeExecQueue(command: string) {
        this.execQueue.push(command);
        if (this.execQueue.length === 1) {
            while(this.execQueue.length) {
                await exec(this.execQueue.slice(0, 1));
                this.execQueue.shift();
            }
        }     
    }
    
    setStatusAction(item: Item) {
        if (item.url) {
            request(item.url.replace(':value', item.status));            
        }
        else if (item.availableStatus) {
            let itemStatus: ItemAvailableStatus = item.availableStatus[item.status];
            console.log(itemStatus.type + ': ' + itemStatus.value);
            if (itemStatus.type === 'url') {
                request(itemStatus.value);
            }
            else if (itemStatus.type === 'exec') {
                exec(itemStatus.value);
            }
            else if (itemStatus.type === 'exec_sync') {
                this.consumeExecQueue(itemStatus.value);
            }
        }        
    }  
            
    setStatusOfTypeNumber(item: Item, status: string): void {
        if (isNaN(Number(status))) {
            throw "Status is not a number.";
        }
        else {
            item.status = status;
        }        
    }
    
    setStatusOfTypeString(item: Item, status: string): void {
        let availableStatus: string[] = Object.keys(item.availableStatus);
        if (availableStatus.indexOf(status) > -1) {
            item.status = status;
        }
        else if (status === "toggle") {
            item.status = this.toggle(availableStatus, item.status);
        }
        else {
            throw "Status does not exist";
        }   
    }
    
    getAllPromiseStatus() {
        let items: Item[] = this.itemModel.get();
        let itemsKeys = Object.keys(items);
        return itemsKeys.map(key => this.getStatus(key));
    }

    allStatus() {
        return Promise.all(this.getAllPromiseStatus());
    }

    mapStatus(callback: (value: ItemStatus) => any) {
        const allPromiseStatus = this.getAllPromiseStatus();
        allPromiseStatus.map(promiseStatus => {
            promiseStatus.then(callback);
        });
    }
    
    // get status is an url request but it could be as well cmd line or mqtt request (:id => status)
    async getStatus(id: string) {
        let response: ItemStatus;
        let item: Item = this.itemModel.getById(id); 
        if (item.statusUrl) {
            response = await this.getStatusFromUrl(id, item.statusUrl);
        }
        else {
            let status: string | number = item.type === "number" ? Number(item.status) : item.status;
            response = {id: id, status: status};
        }
        return response;
    }
    
    // here we should manage error by request
    async getStatusFromUrl(id: string, url: string) {
        try {
            let body = await request(url);
            var data: { status: string } = JSON.parse(body); 
            if (!data || !data.status) 
                return <ItemStatus> {id: id, error: body};            
        }
        catch (error) {
            return <ItemStatus> {id: id, error: error};   
        }
            
        return <ItemStatus> {id: id, status: data.status};
    }

    // allObservable(): Observable<any> {
    //     return Observable.create(observer => 
    //         this.allObserver(observer));        
    // }
    
    // allObserver(observer: Observer<any>) {
    //     let items: Item[] = this.itemModel.get();
    //     let itemsKeys = Object.keys(items);
    //     let waitingForStatus = itemsKeys.length;
    //     let checkIsCompleted = () => {
    //         waitingForStatus--;
    //         if (waitingForStatus < 1) {
    //             observer.onCompleted();
    //         }            
    //     };

    //     for(let key of itemsKeys) {
    //         this.getStatus(key).then(status => {
    //             observer.onNext(status);
    //             checkIsCompleted();
    //         }).catch(error => {
    //             checkIsCompleted();
    //         });
    //     }
    // }    
    
    async definitions() {
        let items: Item[] = this.itemModel.get();
        let defintions: ItemDefinition[] = [];
        for (let key in items) {
            let defintion: ItemDefinition = new ItemDefinition;
            defintion.name = items[key].name;
            if (typeof(items[key].type) !== 'undefined') 
                defintion.type = items[key].type;
            if (typeof(items[key].availableStatus) !== 'undefined')
                defintion.availableStatus = Object.keys(items[key].availableStatus);
            defintions.push(defintion);
        }
        return defintions;
    }
}