import restify = require('restify');
import DashboardService  from './dashboard.service';

export default class {
    constructor(private dashboardService: DashboardService) {}
    
    list(req: restify.Request, res: restify.Response, next: restify.Next) {
        try {
            res.json(200, this.dashboardService.list());
        }
        catch(e) {
            res.json(400, {error: e});
        }
        return next();
    }     
}
