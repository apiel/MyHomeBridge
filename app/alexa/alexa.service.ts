import { Action } from './../action/action';
import { ModelObject } from './../lib/model.helper';
import ActionService  from './../action/action.service';
import moment = require("moment");

// AMAZON.DURATION for timer
// we could count how many time an undefined alexa key has been called

export default class {
    constructor(private alexaModel: ModelObject<Action>, private actionService: ActionService) {}
    
    call(body: any) {        
        console.log(JSON.stringify(body.request.intent.slots, null, 4));
        let slots: {[name: string]: {name: string, value: string}} = body.request.intent.slots;
        let timer: string = slots['timer'].value;
        delete slots['timer'];
        
        let key: string = Object.keys(slots)
                                .filter(k => { return slots[k].hasOwnProperty('value'); })
                                .map(k => { return slots[k].value; })
                                .join('-');
        
        console.log('Alexa call key: ' + key + ' with timer: ' + timer);
        return this.callKey(key, timer);
    }
    
    callKey(key: string, timer: string = null) {
        let response: string;       
        let action: Action = new Action;                
        try {
            let timerSec: number;
            if (timer) {
                timerSec = moment.duration(timer).asSeconds();
                console.log('timer as millis: ' + timerSec);
            }
            action = this.alexaModel.getById(key);
            this.actionService.execute(action, timerSec);  
            response = this.buildResponseBaseOnAction(action, timerSec);
        } 
        catch(error) {
            console.log('Alexa key does not exit, create object key.');
            response = 'Action does not exit, create object key.';
            this.alexaModel.add(key, action)
                           .save();
        }
        
        console.log('Alexa key itemStatus: ' + key);
        console.log(action);      
        
        return this.response(response);        
    }
    
    buildResponseBaseOnAction(action: Action, timerSec: number): string {
        let response: string = 'Action type is not yet defined';
        if (action.type === 'item') {
            response = 'Set status of ' + action.itemStatus.id + ' to ' + action.itemStatus.status;
        }
        else if (action.type === 'action') {
            response = 'Execute action ' + action.actionName;
        }        
        return response + (timerSec ? ' in ' + timerSec + ' seconds' : ''); // here we should use moment and convert timer to string
    }

    response(text: string) {
        return {
            "version": "1.0",
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": text
                },
                "shouldEndSession": true
            },
            "sessionAttributes": {}
        };
    }
}