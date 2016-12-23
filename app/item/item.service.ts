import "babel-polyfill"; // find a solution to get rid of that
require('es6-promise').polyfill(); // find a solution to get rid of that

import * as request from 'request-promise';
//import { exec } from 'child_process';
//import { exec } from 'child-process-promise';
var exec = require('child-process-promise').exec;
import { ModelObject } from './../lib/model.helper';
import { Item, ItemAvailableStatus, ItemStatus } from './item';

export default class {
    constructor(private itemModel: ModelObject<Item>) {}
        
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

    setStatus(id: string, status: string): ItemStatus { // we could make it async to have the same behavior as other
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
        return {id: id, status: item.status};
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
    
    all() {
        let items: Item[] = this.itemModel.get();
        let itemsKeys = Object.keys(items);
        return Promise.all(itemsKeys.map(key => this.getStatus(key)));
    }
    
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
}