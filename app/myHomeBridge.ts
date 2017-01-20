import Events = require('events');
import ItemService from './item/item.service';
import { Item, ItemStatus } from './item/item';
import { Model, ModelObject } from './lib/model.helper';
import Httpd from './lib/httpd.service';

var mosca = require('mosca');

const eventEmitter = new Events.EventEmitter();

let httpd = new Httpd();

// We could find a way to load each module in a generic way, with dependency...


let itemModel = new ModelObject<Item>("/../data/items.json");
let itemService = new ItemService(itemModel, eventEmitter);
httpd.get('/item/definitions', [], itemService.definitions.bind(itemService));
httpd.get('/item/status', ['id'], itemService.getStatus.bind(itemService));
httpd.get('/item', ['id', 'status'], itemService.setStatusAsync.bind(itemService));
httpd.get('/items', ['id', 'status'], itemService.allStatus.bind(itemService));


import TriggerService  from './trigger/trigger.service';
import { Trigger } from './trigger/trigger';
let triggerModel = new ModelObject<Trigger>("/../data/triggers.json");
let triggerService = new TriggerService(triggerModel);


import { Timer } from './timer/timer';
import TimerService from './timer/timer.service';
let timerModel = new Model<Timer[]>("/../data/timers.json");
let timerService = new TimerService(timerModel, itemService);
timerService.init();


import ActionService  from './action/action.service';
import { Action } from './action/action';
let actionModel = new ModelObject<Action[]>("/../data/actions.json");
let actionService = new ActionService(actionModel, itemService, timerService);
httpd.get('/action/definitions', [], actionService.definitions.bind(actionService));
httpd.get('/action/:name', ['name'], actionService.call.bind(actionService)); // we should change it as item




import AlexaService  from './alexa/alexa.service';
let alexaModel = new ModelObject<Action>("/../data/alexa.json");
let alexaService = new AlexaService(alexaModel, actionService);
httpd.post('/alexa', alexaService.call.bind(alexaService));





import DashboardService  from './dashboard/dashboard.service';
import { DashboardCategory } from './dashboard/dashboard';
let dashboardModel = new Model<DashboardCategory[]>("/../data/dashboard.json");
let dashboardService = new DashboardService(dashboardModel, itemService, actionService);
httpd.get('/dashboard/list', [], dashboardService.list.bind(dashboardService));


httpd.serve();


// Mosca setup

var mqttd = new mosca.Server({
  port: 1883,
  persistence: {
    factory: mosca.persistence.Memory
  }
});


mqttd.on('ready', () => {
    try {
        itemService.mapStatus(itemStatus => {
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
});

// this should go in controller?
eventEmitter.on('set/item/status', (itemStatus: ItemStatus) => {
   //console.log('eventEmitter: set/item/status', itemStatus);
    mqttd.publish({
        topic: 'item/' + itemStatus.id,
        payload: itemStatus.status,
        retain: true,
        qos: 0
    });   
});
// eventEmitter.on('set/item/status', (itemStatus: ItemStatus) => mqtt.publish('item/' + itemStatus.id, itemStatus.status);



// this should go in controller
mqttd.on('published', (packet: any, client: any) => { 
  // Here we should force retain
  if (client && client.id !== 'myhomebridge-server') {
    if (packet.topic.indexOf('item/') === 0)
      itemService.setStatus(packet.topic.substring(5), packet.payload.toString());
    if (packet.topic.indexOf('action/') === 0)
      this.actionService.call(packet.substring(6).topic);
  }
});

