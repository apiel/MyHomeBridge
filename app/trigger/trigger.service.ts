import * as request from 'request';
import Model from './../lib/model.helper';
import { Trigger } from './trigger';
import { ItemStatus } from './../item/item';

export default class {
    constructor(private triggerModel: Model<Trigger>) {}
    
    parseItemsStatus(itemsStatus: ItemStatus[]): void {
        let _itemsStatus: any = {};
        for (let itemStatus of itemsStatus) {
            _itemsStatus[itemStatus.id] = itemStatus.status;
        }
        
        for (let trigger of this.triggerModel.all()) {
            let isTrue = false;
            for (let condition of trigger.trigger) {
                let itemStatus = _itemsStatus[condition.item];
                if (itemStatus) {
                    if (condition.operator === 'is') {
                        isTrue = itemStatus == condition.value;
                    }
                    else if (condition.operator === 'lower') {
                        isTrue = itemStatus < condition.value;
                    }
                    else if (condition.operator === 'upper') {
                        isTrue = itemStatus > condition.value;
                    }                
                }
                if (!isTrue) break;
            }
            if (isTrue) {
                console.log(trigger.name + ' is true.');
                request(trigger.url);
            }
        }
    } 
}