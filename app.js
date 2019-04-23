// NOTE: use this as Global variable
WebSocket = require('ws');

const Paho = require('paho-mqtt');

// Create a client instance
var port = 32051;
var host = "m16.cloudmqtt.com";
var clientId = "airstream";
var username = "";
var password = "";
client = new Paho.Client(host, port, clientId);
var topic = "out";

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

var options = {
    useSSL: true,
    userName: username,
    password: password,
    onSuccess: onConnect,
    onFailure: doFail
};

// connect the client
client.connect(options);

// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe(topic);
    // Keep alive the channel
    keepAlive('KA');
}

function doFail(e){
    console.log(e);
}

function keepAlive(message) {
    setInterval(function(){ send(message); }, 9500);
}

function send(_message) {
    var message = new Paho.Message(_message);
    message.destinationName = topic;
    client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        write(responseObject.errorMessage);
    }
}

// called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
    write(message.payloadString);
}

function write(message) {
    var d = new Date();
    var date = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    message = '[' + date + ']: ' + message;
    console.log(message);
}
