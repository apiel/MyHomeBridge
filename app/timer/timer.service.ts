import { ModelObject } from './../lib/model.helper';
import { ItemStatus } from './../item/item';
import ItemService from './../item/item.service';

export default class {
    constructor(private actionModel: ModelObject<ItemStatus[]>, private itemService: ItemService) {}

}