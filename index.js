const mqtt = require('mqtt');

// Connection variables
let broker_host = '64f045e5514042d9a76cb326c1ab0c7f.s1.eu.hivemq.cloud';
let broker_port = 8883;
let client_id = 'ys_client';

// Publish variables
let pub_topic = 'General';
let message = 'Greetings from ' + client_id.toString();
let pub_options = {qos: 0, retain: false};

// Subscribe variables
let sub_topic = 'General';
let sub_options = {qos: 0};


const connection_options = {
    port: broker_port,
    host: broker_host,
    clientId: client_id,
    protocol: 'mqtts',
    username: 'Meezi',
    password:"78782525",
    reconnectPeriod: 5000 // Try reconnecting in 5 seconds if connection is lost
};

const client = mqtt.connect(connection_options);

client.on('message', function (topic, message) {
    console.log("Received message " + message.toString() + " on topic: " + topic.toString());
})

client.on('connect', async function () {
    console.log('Connection successful');
    client.subscribe(sub_topic, sub_options, function (err) {
        if (err) {
            console.log("An error occurred while subscribing")
        } else {
            console.log("Subscribed successfully to " + sub_topic.toString())
        }
    });

    while (client.connected) {
        client.publish(pub_topic, message, pub_options, function (err) {
            if (err) {
                console.log("An error occurred during publish")
            } else {
                console.log("Published successfully to " + pub_topic.toString())
            }
        });

        // Delay of 5 seconds
        await new Promise(resolve => setTimeout(resolve, 8000));
    }
})

// Handle errors
client.on("error", function (error) {
    console.log("Error occurred: " + error);
});

// Notify reconnection
client.on("reconnect", function () {
    console.log("Reconnection starting");
});

// Notify offline status
client.on("offline", function () {
    console.log("Currently offline. Please check internet!");
});