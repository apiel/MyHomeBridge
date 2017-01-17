
import restify = require('restify');
import ItemService from './item.service';
import { Item, ItemStatus } from './item';

export default class {
    constructor(private itemService: ItemService) {}
        
    status(req: restify.Request, res: restify.Response, next: restify.Next) {
        console.log('Controller item status');
        let id = req.params['id'];
        
        this.itemService.getStatus(id)
            .then((itemStatus: ItemStatus) => res.json(200, itemStatus))
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
        this.itemService.allStatus()
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

    setup(mqttd: any) {
        try {
            this.itemService.mapStatus(itemStatus => {
                    console.log(itemStatus);
                    mqttd.publish({
                        topic: itemStatus.id,
                        payload: itemStatus.status,
                        retain: true,
                        qos: 0
                    });
                }); 
            // this.itemService.allObservable().subscribe(
            //     itemStatus => {
            //         mqttd.publish({
            //             topic: itemStatus.id,
            //             payload: itemStatus.status,
            //             retain: true,
            //             qos: 0
            //         });
            //     }
            // );            
        }
        catch(error) {
            console.log('Error on item setup: ', error);
        }        
    }
}
