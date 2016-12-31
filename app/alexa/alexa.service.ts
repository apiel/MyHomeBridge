import { Action } from './../action/action';
import { ModelObject } from './../lib/model.helper';
import ActionService  from './../action/action.service';
import moment = require("moment");

// AMAZON.DURATION for timer

export default class {
    constructor(private alexaModel: ModelObject<Action>, private actionService: ActionService) {}
    
    call(body: any) {        
        console.log(JSON.stringify(body.request.intent.slots, null, 4));
        let slots: {[name: string]: {name: string, value: string}} = body.request.intent.slots;
        let key: string = slots['device'].value + '-'
                        + slots['devicebis'].value + '-'
                        + slots['room'].value + '-'
                        + slots['status'].value;
        console.log('Timer: ' + slots['timer'].value);
        return this.callKey(key, slots['timer'].value);
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
        let response: string = 'Execute action.';
        if (action.type === 'item') {
            response = 'Set status of ' + action.itemStatus.id + ' to ' + action.itemStatus.status;
        }
        else if (action.type === 'action') {
            response = 'Execute action ' + action.actionName;
        }        
        return response + (timerSec ? 'in ' + timerSec + ' seconds' : ''); // here we should use moment and convert timer to string
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