const SerialPort = require('serialport');
const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://broker.hivemq.com', {port: 1883});

// ODE JE POTREBNO PROMJENITI BROJ PORTA npr. COM3
const port = new SerialPort('COM4', {
    baudRate: 115200,
    parser: SerialPort.parsers.readline("\n")
});

port.on('open',() => {
    console.log("Serial Port is opened. Communication starts...");
});

// ODE SE PRIMAJU PODACI SA SERIAL PORTA -> varijabla data
port.on('data', (data) => {
    let arr = data.split(": ");

    if(arr[0] == 'Humidity') {
        client.publish('SensorStation/hum', arr[1]);
    } else if(arr[0] == 'Temperature') {
        client.publish('SensorStation/temp', arr[1]);
    } else {
        console.log("Fail!!!");
    }
});