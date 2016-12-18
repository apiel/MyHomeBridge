
import restify = require('restify');
import ItemController from './item/item.controller';
import ItemService from './item/item.service';
import ItemModel from './item/item.model';

restify.CORS.ALLOW_HEADERS.push('authorization');

var server = restify.createServer();
server.use(restify.CORS());

let itemModel = new ItemModel();
let itemService = new ItemService(itemModel);
let itemController = new ItemController(itemService);
server.get('/item/:id/status', itemController.status.bind(itemController));
server.get('/item/:id/:status', itemController.setStatus.bind(itemController));
server.get('/items', itemController.all.bind(itemController));

server.listen(3030, function() {
  console.log('%s listening at %s', server.name, server.url);
});