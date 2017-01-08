
import restify = require('restify');
import ItemService from './item.service';
import { Item } from './item';

export default class {
    constructor(private itemService: ItemService) {}
        
    status(req: restify.Request, res: restify.Response, next: restify.Next) {
        console.log('Controller item status');
        let id = req.params['id'];
        
        this.itemService.getStatus(id)
            .then(data => res.json(200, data))
            .catch(error => res.json(400, error));
        
        return next();
    }     
    
    setStatus(req: restify.Request, res: restify.Response, next: restify.Next) {
        console.log('Controller item setStatus');
        let id = req.params['id'];
        let status = req.params['status'];
        try {    
            res.json(200, this.itemService.setStatus(id, status));
        }
        catch(e) {
            res.json(400, {error: e});
        }
        return next();
    } 
    
    // we should handle error by request if one or the service is not running
    all(req: restify.Request, res: restify.Response, next: restify.Next) {
        console.log('Controller item all');
        this.itemService.all()
                        .then(data => res.json(200, data))
                        .catch(error => res.json(400, error));
        return next();
    }  
    
    definitions(req: restify.Request, res: restify.Response, next: restify.Next) {
        try {    
            res.json(200, this.itemService.definitions());
        }
        catch(e) {
            res.json(400, {error: e});
        }
        return next();
    }    
}
