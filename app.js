
const app =  require('express')()
const server = require('http').createServer(app)
const mqtt = require('mqtt')
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
})

const {MAX, MIN} = require('./constants.js')
const {DEVICE_TRIGGERS, SYSTEM_TRIGGERS} = require('./triggers.js')

//Namespaces
const ALL = io.of('/')
const MONITORING_STATION = io.of('/monitoringstation')
const DOCTORS = io.of('/doctor')
const NURSES = io.of('/nurse')
const ADMINS = io.of('/admin')
const SUPER_ADMINS = io.of('/superadmin')

//MQTT Connection
const client = mqtt.connect('mqtt://122.160.15.59')
client.on('connect', ()=>{
    client.subscribe('details', (err)=>{
        if(!err) console.log('Subscribed to MQTT Successfully!')
    })
})

function checkTriggers(vitals){

    let triggers = []
    
    if(vitals){
        if(vitals.trigger === 1) triggers.push(DEVICE_TRIGGERS.SOS)
        if(vitals.trigger === 3) triggers.push(DEVICE_TRIGGERS.DEVICE_RESTARTED)
        if(vitals.trigger === 4) triggers.push(DEVICE_TRIGGERS.DEVICE_REMOVED)
        if(vitals.heartRate > MAX.HEART_RATE) triggers.push(SYSTEM_TRIGGERS.HIGH_HEART_RATE)
        if(vitals.heartRate < MIN.HEART_RATE) triggers.push(SYSTEM_TRIGGERS.LOW_HEART_RATE)
        if(vitals.bpd > MAX.BPD) triggers.push(SYSTEM_TRIGGERS.HIGH_BPD)
        if(vitals.bpd < MIN.BPD) triggers.push(SYSTEM_TRIGGERS.LOW_BPD)
        if(vitals.bps > MAX.BPS) triggers.push(SYSTEM_TRIGGERS.HIGH_BPS)
        if(vitals.bps < MIN.BPS) triggers.push(SYSTEM_TRIGGERS.LOW_BPS)
        if(vitals.spo2 > MAX.SPO2) triggers.push(SYSTEM_TRIGGERS.HIGH_SPO2)
        if(vitals.spo2 > MAX.SPO2) triggers.push(SYSTEM_TRIGGERS.HIGH_SPO2)
        if(vitals.bodyTemp > MAX.BODY_TEMP) triggers.push(SYSTEM_TRIGGERS.HIGH_BODY_TEMP)
        if(vitals.bodyTemp < MIN.BODY_TEMP) triggers.push(SYSTEM_TRIGGERS.LOW_BODY_TEMP)
        if(vitals.battery < MIN.BATTERY) triggers.push(SYSTEM_TRIGGERS.LOW_BATTERY)
    }

    return triggers
}

io.on('connection', (socket)=>{
    console.log('Client connected', socket.id)
    socket.on('subscribe', (payload)=>{
        console.log(payload)

        // client.on('message', (topic, message)=>{
        //     // data = {...message}
        //     console.log(JSON.parse(message))
        //     socket.emit('liveData', message)
        //     console.log('emitted')
        // })
    })
    socket.on('disconnect', () => console.log(`Client Disconnected -${socket.id}`))
})

MONITORING_STATION.on('connection', (socket)=> {
    console.log(`${socket.id} - connected to Monitoring Station Namespace`)
    
    socket.on('subscribe', (payload)=>{
        // console.log(payload)
        client.on('message', (topic, message)=>{
            // payload.MACS.forEach(MAC => {
            //     console.log({MAC: MAC, ...JSON.parse(message)})
            // })
            let triggers = checkTriggers(JSON.parse(message))
            socket.emit('liveData', {...JSON.parse(message), triggers})
            console.log('emitted')
        })
    })
    socket.on('disconnect', () =>  console.log(`Client Disconnected From Monitoring Station - ${socket.id}`))
})


server.listen(5000, ()=> console.log('Server listening @ PORT - 5000'))