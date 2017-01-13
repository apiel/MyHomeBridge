import restify = require('restify');
import Events = require('events');
import ItemController from './item/item.controller';
import ItemService from './item/item.service';
import { Item, ItemStatus } from './item/item';
import { Model, ModelObject } from './lib/model.helper';

var mosca = require('mosca');

const eventEmitter = new Events.EventEmitter();

// Restify setup
restify.CORS.ALLOW_HEADERS.push('authorization');
var httpd = restify.createServer();
httpd.use(restify.bodyParser({ mapParams: false }));
httpd.use(restify.CORS());

// Mosca setup

var mqttd = new mosca.Server({
  port: 1883,
  persistence: {
    factory: mosca.persistence.Memory
  }
});
eventEmitter.on('set/item/status', (itemStatus: ItemStatus) => {
   //console.log('eventEmitter: set/item/status', itemStatus);
    mqttd.publish({
        topic: 'item/' + itemStatus.id,
        payload: itemStatus.status,
        retain: true,
        qos: 0
    });   
});

// We could find a way to load each module in a generic way, with dependency...


let itemModel = new ModelObject<Item>("/../data/items.json");
let itemService = new ItemService(itemModel, eventEmitter);
let itemController = new ItemController(itemService);
httpd.get('/item/definitions', itemController.definitions.bind(itemController));
httpd.get('/item/:id/status', itemController.status.bind(itemController));
httpd.get('/item/:id/:status', itemController.setStatus.bind(itemController));
httpd.get('/items', itemController.all.bind(itemController));

mqttd.on('ready', itemController.setup.bind(itemController, mqttd));



import TriggerController from './trigger/trigger.controller';
import TriggerService  from './trigger/trigger.service';
import { Trigger } from './trigger/trigger';
let triggerModel = new ModelObject<Trigger>("/../data/triggers.json");
let triggerService = new TriggerService(triggerModel);
let triggerController = new TriggerController(triggerService);
httpd.post('/trigger/push', triggerController.push.bind(triggerController));



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
httpd.get('/action/definitions', actionController.definitions.bind(actionController));
httpd.get('/action/:name', actionController.call.bind(actionController));

// we need to change 
// httpd.get('/item/:id/status',   to   /item/status?id=:id
// httpd.get('/item/:id/:status',  to   /item?id=:id&status=:status
// since :id can contain a /
mqttd.on('published', (packet: any, client: any) => { // this should go in controller
  if (client) {
    if (packet.topic.indexOf('item/') === 0)
      itemService.setStatus(packet.topic.substring(5), packet.payload.toString());
    if (packet.topic.indexOf('action/') === 0)
      this.actionService.call(packet.substring(6).topic);
  }
});



import AlexaController from './alexa/alexa.controller';
import AlexaService  from './alexa/alexa.service';
let alexaModel = new ModelObject<Action>("/../data/alexa.json");
let alexaService = new AlexaService(alexaModel, actionService);
let alexaController = new AlexaController(alexaService);
httpd.post('/alexa', alexaController.call.bind(alexaController));
//httpd.post('/alexa/:key', alexaController.callKey.bind(alexaController));




import DashboardController from './dashboard/dashboard.controller';
import DashboardService  from './dashboard/dashboard.service';
import { DashboardCategory } from './dashboard/dashboard';
let dashboardModel = new Model<DashboardCategory[]>("/../data/dashboard.json");
let dashboardService = new DashboardService(dashboardModel, itemService, actionService);
let dashboardController = new DashboardController(dashboardService);
httpd.get('/dashboard/list', dashboardController.list.bind(dashboardController));


httpd.listen(3030, function() {
  console.log('%s listening at %s', httpd.name, httpd.url);
});