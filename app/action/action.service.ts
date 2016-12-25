import { ModelObject } from './../lib/model.helper';
import { Action } from './action';
import ItemService from './../item/item.service';
import TimerService from './../timer/timer.service';

export default class {
    constructor(private actionModel: ModelObject<Action[]>, 
                private itemService: ItemService,
                private timerService: TimerService) {}
    
    call(name: string) {
        let actions: Action[] = this.actionModel.getById(name);
        return actions.map(action => {
            if (action.type === 'item') {
                if (action.timer > 0) {
                    this.timerService.add(action.value, action.timer);
                }
                else {
                    return this.itemService.setStatus(action.value.id, action.value.status.toString());                    
                }
            }
        });
    }
}