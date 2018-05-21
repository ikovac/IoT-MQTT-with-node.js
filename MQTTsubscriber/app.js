const express = require('express');
const path = require('path');

const mqtt = require('mqtt');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(express.static(path.join(__dirname, 'public')));

const client = mqtt.connect('mqtt://broker.hivemq.com', {port: 1883});


// Ode stavljas na koje ces se topice subscribat.
client.on('connect', () => {
    console.log("Connected!");
    client.subscribe('SensorStation/temp');
    client.subscribe('SensorStation/hum');
});

// Kad publisher objavi poruku onda se trigera ovaj event koji primi poruku i topic za koji je ta poruka.
// Primljene vrijednosti pomocu socketa emitiram na clienta (da se promijene vrijednosti kazaljki)
client.on('message', (topic, message) => {
    if(topic === 'SensorStation/temp') {
        io.emit('sensor-temp', Number(message.toString()));
    } else if(topic === 'SensorStation/hum') {
        io.emit('sensor-hum', Number(message.toString()));
    } else {

    }
});


// Kad odeš na localhost:3000 kao response ti vraća index.html
app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
});

// podigni server na portu 3000.
server.listen(3000, () => {
    console.log("Listening to port 3000");
})
