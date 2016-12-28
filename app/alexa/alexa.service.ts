// AMAZON.DURATION for timer

export default class {
    constructor() {}
    
    call(body: any) {
        console.log(body);
        return this.response('my home bridge response');
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