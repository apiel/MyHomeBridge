import { Model } from './../lib/model.helper';
import ItemService from './../item/item.service';
import ActionService from './../action/action.service';
import { DashboardCategory, DashboardItem } from './../dashboard/dashboard';

export default class {
    constructor(private dashboardModel: Model<DashboardCategory[]>, private itemService: ItemService, 
                private actionService: ActionService) {}
    
    list() {
        for(let category of this.dashboardModel.get()) {
            console.log(category.name);
        }
    }
}
// [  
//     {
//         "name": "Chill area",
//         "items": [
//             {"key": "chill", "type": "item", "item": {"availableStatus": ["on", "off"], "status": "off"}},
//             {"key": "table", "type": "item", "item": {"availableStatus": ["on", "off"], "status": "on"}},
//             {"key": "temperature", "type": "item", "item": {"type": "number", "status": 22}},
//             {"key": "chillareaOn", "type": "action"}
//         ]
//     },
//     {
//         "name": "kitchen / living room",
//         "items": [
//             {"key": "kitchen", "type": "item"},
//             {"key": "wall", "type": "item"}
//         ]
//     }        
// ]