import restify = require('restify');
import TriggerService  from './trigger.service';
import { ItemStatus } from './../item/item';

export default class {
    constructor(private triggerService: TriggerService) {}
    
    // this should go away and the push function should just extend the setItemStatus or...
    push(req: restify.Request, res: restify.Response, next: restify.Next) {
        try {
            let itemsStatus: ItemStatus[] = JSON.parse(req.params.status);
            this.triggerService.parseItemsStatus(itemsStatus);
            res.json(200, {ok: true});
        }
        catch(e) {
            res.json(400, {error: e});
        }
        return next();
    }  
}
