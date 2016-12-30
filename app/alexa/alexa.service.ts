import { Action } from './../action/action';
import { ModelObject } from './../lib/model.helper';
import ActionService  from './../action/action.service';

// AMAZON.DURATION for timer

export default class {
    constructor(private alexaModel: ModelObject<Action>, private actionService: ActionService) {}
    
    call(body: any) {        
        let slots: {[name: string]: {name: string, value: string}} = body.request.intent.slots;
        let key: string = slots['device'].value + '-'
                        + slots['devicebis'].value + '-'
                        + slots['room'].value + '-'
                        + slots['status'].value;
               
        let response: string;       
        let action: Action = new Action;                
        try {
            action = this.alexaModel.getById(key);
            this.actionService.execute(action, 0);  
            response = this.buildResponseBaseOnAction(action);
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
    
    buildResponseBaseOnAction(action: Action): string {
        let response: string = 'Execute action.';
        if (action.type === 'item') {
            response = 'Set status of ' + action.itemStatus.id + ' to ' + action.itemStatus.status;
        }
        else if (action.type === 'action') {
            response = 'Execute action ' + action.actionName;
        }        
        return response;
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