
import restify = require('restify');
import ItemController from './item/item.controller';
import ItemService from './item/item.service';
import { Item } from './item/item';
import Model from './lib/model.helper';

restify.CORS.ALLOW_HEADERS.push('authorization');

var server = restify.createServer();
server.use(restify.CORS());

let itemModel = new Model<Item>("/../data/items.json");
let itemService = new ItemService(itemModel);
let itemController = new ItemController(itemService);
server.get('/item/:id/status', itemController.status.bind(itemController));
server.get('/item/:id/:status', itemController.setStatus.bind(itemController));
server.get('/items', itemController.all.bind(itemController));



import TriggerController from './trigger/trigger.controller';
import TriggerService  from './trigger/trigger.service';
import { Trigger } from './trigger/trigger';
let triggerModel = new Model<Trigger>("/../data/trigger.json");
let triggerService = new TriggerService(triggerModel);
let triggerController = new TriggerController(triggerService);
server.post('/trigger/push', triggerController.push.bind(triggerController));

server.listen(3030, function() {
  console.log('%s listening at %s', server.name, server.url);
});