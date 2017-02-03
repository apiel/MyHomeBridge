
// We should be able to choose between self hosted mqtt broker 
// Or an external broker

//import * as mqtt from 'mqtt'; // mqtt client if not use mqtt broker


// we might have a main service and then some child service for  item, action...
      

// var client  = mqtt.connect('mqtt://test.mosquitto.org')
 
// client.on('connect', function () {
//   client.subscribe('presence')
//   client.publish('presence', 'Hello mqtt')
// })
 
// client.on('message', function (topic, message) {
//   // message is Buffer 
//   console.log(message.toString())
//   client.end()
// })

const mosca = require('mosca'); // mqtt broker

export class Mqttd {
    mqttd: any;
    separator: string = '/';

    constructor(port: number = 1883) {
        this.mqttd = new mosca.Server({
            port: port,
            persistence: {
                factory: mosca.persistence.Memory
            }
        });
    }

    attachHttpServer(httpServer: any) {
        this.mqttd.attachHttpServer(httpServer);
    }

    publish(topic: string, payload: string, retain: boolean = true, qos: number = 0) {
        this.mqttd.publish({
            topic: topic,
            payload: payload,
            retain: retain,
            qos: qos
        }); 
        return this;
    }

    ready(callback: Function) {
        this.mqttd.on('ready', callback);
        return this;
    }

    onPublished(callback: (packet: any, client: any) => any) {
        this.mqttd.on('published', (packet: any, client: any) => { 
            // Here we could force retain
            if (client) { //  && client.id !== 'myhomebridge-server' --> for external mqtt server
                callback(packet, client);
            }
        });
        return this;
    }
}

export class MqttdRoute { // not sure that's the bestName
    constructor(private mqttd: Mqttd, private baseTopicLevel: string) {
        this.baseTopicLevel = this.baseTopicLevel + this.mqttd.separator;
    }

    publish(topic: string, payload: string, retain: boolean = true, qos: number = 0) {
        this.mqttd.publish(this.baseTopicLevel + topic,
                            payload, retain, qos);
        return this;
    }

    onPublished(callback: (packet: any, client: any) => any) {
        this.mqttd.onPublished((packet: any, client: any) => { 
            if (packet.topic.indexOf(this.baseTopicLevel) === 0) {
                packet.topic = packet.topic.substring(this.baseTopicLevel.length);
                callback(packet, client);
            }
        });
        return this;
    }
}