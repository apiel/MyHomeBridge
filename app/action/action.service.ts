import { ModelObject } from './../lib/model.helper';
import { ActionBase, Action, ActionDefinition } from './action';
import ItemService from './../item/item.service';
import TimerService from './../timer/timer.service';

export default class {
    constructor(private actionModel: ModelObject<ActionBase>, 
                private itemService: ItemService,
                private timerService: TimerService) {}
    
    async call(name: string, timer: number = 0) {
        let actions: Action[] = this.actionModel.getById(name).actions;
        return actions.map(action => this.execute(action, timer));
    }
    
    execute(action: Action, timer: number = 0) {
        if (action.type === 'item') {
            if (action.timer + timer > 0) {
                this.timerService.add(action.itemStatus, action.timer + timer);
            }
            else {
                return this.itemService.setStatus(action.itemStatus.id, action.itemStatus.status.toString());                    
            }
        }
        else if (action.type === 'action') {
            this.call(action.actionName, action.timer);
        }        
    }
    
    async definitions() {
        let actionsDef: ActionDefinition[] = [];
        const actions: ActionBase[] = this.actionModel.get();
        for (let key in actions) {
            actionsDef.push({ name: actions[key].name, key: key });
        }
        return actionsDef;
    }
}