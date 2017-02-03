import restify = require('restify');

export default class {
    httpd: restify.Server;

    constructor() {
        restify.CORS.ALLOW_HEADERS.push('authorization');
        this.httpd = restify.createServer();
        this.httpd.use(restify.bodyParser({ mapParams: false }));
        this.httpd.use(restify.queryParser()); // take care that it doesnt conflict with Alexa
        this.httpd.use(restify.CORS());
    }

    serve(port: number = 3030) {
        this.httpd.listen(port, () => {
            console.log('%s listening at %s', this.httpd.name, this.httpd.url);
        });     
    }

    get(route: any, parametersRules: string[], callbackFunction: Function) {
        this.httpd.get(route, (request: restify.Request, response: restify.Response, next: restify.Next) => {
            this.getAction(request, response, parametersRules, callbackFunction);
            return next();            
        });
    }
    
    async getAction(request: restify.Request, response: restify.Response, 
                    parametersRules: string[], callbackFunction: Function) {
        try {
            let params = this.validateParameters(request.params, parametersRules);
            var responseValue = await callbackFunction(...params);
            response.json(200, responseValue);
        }
        catch(error) {
            response.json(400, error);
        }
    }

    post(route: any, callbackFunction: Function) {
        this.httpd.post(route, (request: restify.Request, response: restify.Response, next: restify.Next) => {
            this.postAction(request, response,  callbackFunction);
            return next();            
        });
    }

    async postAction(request: restify.Request, response: restify.Response, callbackFunction: Function) {
        try {
            let body: any = request.body;
            var responseValue = await callbackFunction(body);
            response.json(200, responseValue);
        }
        catch(error) {
            response.json(400, error);
        }
    }    
       
    validateParameters(parameters: any, rules: string[]) {
        let returnValidParams = [];
        for(let rule of rules) {
            if (parameters.hasOwnProperty(rule)) {
                returnValidParams.push(parameters[rule]);
            }
            else {
                throw 'Parameter ' + rule + ' is missing.';
            }
        }
        return returnValidParams;
    }
}