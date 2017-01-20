
// We should be able to choose between self hosted mqtt broker 
// Or an external broker

import * as mqtt from 'mqtt'; // mqtt client if not use mqtt broker
var mosca = require('mosca'); // mqtt broker

var mqttd = new mosca.Server({
  port: 1883,
  persistence: {
    factory: mosca.persistence.Memory
  }
});

let onPublished = (callback: (packet: any, client: any) => any) => {
    mqttd.on('published', (packet: any, client: any) => { 
        // Here we should force retain
        if (client && client.id !== 'myhomebridge-server') {
            callback(packet, client);
        }
    });
}

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

