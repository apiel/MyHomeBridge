import restify = require('restify');
import ActionService  from './action.service';
import { ItemStatus } from './../item/item';

export default class {
    constructor(private actionService: ActionService) {}
    
    call(req: restify.Request, res: restify.Response, next: restify.Next) {
        let name: string = req.params.name;
        try {
            let status = this.actionService.call(name);
            res.json(200, status);
        }
        catch(e) {
            res.json(200, {error: e});
        }
        return next();
    }  
}
