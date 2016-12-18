
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
            let item: Item = this.itemService.setStatus(id, status);            
            res.json(200, {status: item.status});
        }
        catch(e) {
            res.json(200, {error: e});
        }
        return next();
    } 
    
    all(req: restify.Request, res: restify.Response, next: restify.Next) {
        console.log('Controller item all');
        this.itemService.all()
                        .then(data => res.json(200, data))
                        .catch(error => res.json(400, error));
        return next();
    }     
}
