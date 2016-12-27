import restify = require('restify');
import AlexaService  from './alexa.service';

export default class {
    constructor(private alexaService: AlexaService) {}
    
    call(req: restify.Request, res: restify.Response, next: restify.Next) {
        console.log(JSON.stringify(req ,null, 4));
        try {
            let response = this.alexaService.call();
            res.json(200, response);
        }
        catch(e) {
            res.json(400, {error: e});
        }
        return next();
    }  
}
