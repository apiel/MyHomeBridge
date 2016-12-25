
import restify = require('restify');
import ItemController from './item/item.controller';
import ItemService from './item/item.service';
import { Item, ItemStatus } from './item/item';
import { Model, ModelObject } from './lib/model.helper';

restify.CORS.ALLOW_HEADERS.push('authorization');

var server = restify.createServer();
server.use(restify.CORS());

let itemModel = new ModelObject<Item>("/../data/items.json");
let itemService = new ItemService(itemModel);
let itemController = new ItemController(itemService);
server.get('/item/:id/status', itemController.status.bind(itemController));
server.get('/item/:id/:status', itemController.setStatus.bind(itemController));
server.get('/items', itemController.all.bind(itemController));



import TriggerController from './trigger/trigger.controller';
import TriggerService  from './trigger/trigger.service';
import { Trigger } from './trigger/trigger';
let triggerModel = new ModelObject<Trigger>("/../data/triggers.json");
let triggerService = new TriggerService(triggerModel);
let triggerController = new TriggerController(triggerService);
server.post('/trigger/push', triggerController.push.bind(triggerController));



import { Timer } from './timer/timer';
import TimerService from './timer/timer.service';
let timerModel = new Model<Timer[]>("/../data/timers.json");
let timerService = new TimerService(timerModel, itemService);
timerService.init();


import ActionController from './action/action.controller';
import ActionService  from './action/action.service';
import { Action } from './action/action';
let actionModel = new ModelObject<Action[]>("/../data/actions.json");
let actionService = new ActionService(actionModel, itemService, timerService);
let actionController = new ActionController(actionService);
server.get('/action/:name', actionController.call.bind(actionController));


server.listen(3030, function() {
  console.log('%s listening at %s', server.name, server.url);
});