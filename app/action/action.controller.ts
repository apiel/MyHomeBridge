import restify = require('restify');
import ActionService  from './action.service';

export default class {
    constructor(private actionService: ActionService) {}
    
    call(req: restify.Request, res: restify.Response, next: restify.Next) {
        let name: string = req.params.name;
        try {
            let status = this.actionService.call(name);
            res.json(200, status);
        }
        catch(e) {
            res.json(400, {error: e});
        }
        return next();
    }
    
    definitions(req: restify.Request, res: restify.Response, next: restify.Next) {
        try {
            let definitions = this.actionService.definitions();
            res.json(200, definitions);
        }
        catch(e) {
            res.json(400, {error: e});
        }
        return next();
    }        
}
