import * as request from 'request';
import { ModelObject } from './../lib/model.helper';
import { ItemStatus } from './../item/item';
import ItemService from './../item/item.service';

export default class {
    constructor(private actionModel: ModelObject<ItemStatus[]>, private itemService: ItemService) {}
    
    call(name: string) {
        let actions: ItemStatus[] = this.actionModel.getById(name);
        return actions.map(action => this.itemService
                                         .setStatus(action.id, action.status.toString()));
    }
}