"use strict";
class default_1 {
    constructor(itemService) {
        this.itemService = itemService;
    }
    status(req, res, next) {
        console.log('Controller item status');
        let id = req.params['id'];
        this.itemService.getStatus(id)
            .then(data => res.json(200, data))
            .catch(error => res.json(400, error));
        return next();
    }
    setStatus(req, res, next) {
        console.log('Controller item setStatus');
        let id = req.params['id'];
        let status = req.params['status'];
        try {
            let item = this.itemService.setStatus(id, status);
            res.json(200, { status: item.status });
        }
        catch (e) {
            res.json(200, { error: e });
        }
        return next();
    }
    all(req, res, next) {
        console.log('Controller item all');
        this.itemService.all()
            .then(data => res.json(200, data))
            .catch(error => res.json(400, error));
        return next();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
