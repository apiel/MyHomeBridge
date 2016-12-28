import restify = require('restify');
import AlexaService  from './alexa.service';
import AlexaHandler  from './alexa.handler';

export default class {
    constructor(private alexaService: AlexaService) {}
    
    call(req: restify.Request, res: restify.Response, next: restify.Next) {
        AlexaHandler(req, res, () => {
            let body: any = req.body;
            try {
                let response = this.alexaService.call(body);
                res.json(200, response);
            }
            catch(e) {
                res.json(400, {error: e});
            }
            return next();
        })
    } 
}
