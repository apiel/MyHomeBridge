"use strict";
const restify = require("restify");
const item_controller_1 = require("./item/item.controller");
const item_service_1 = require("./item/item.service");
const item_model_1 = require("./item/item.model");
restify.CORS.ALLOW_HEADERS.push('authorization');
var server = restify.createServer();
server.use(restify.CORS());
let itemModel = new item_model_1.default();
let itemService = new item_service_1.default(itemModel);
let itemController = new item_controller_1.default(itemService);
server.get('/item/:id/status', itemController.status.bind(itemController));
server.get('/item/:id/:status', itemController.setStatus.bind(itemController));
server.get('/items', itemController.all.bind(itemController));
server.listen(3030, function () {
    console.log('%s listening at %s', server.name, server.url);
});
