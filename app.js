
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
const ERROR = require('./errors')

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

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

function getDummyVitals(){

    let heartRate = randomIntFromInterval(60, 100) //60 - 100 normal 
    let spo2 = randomIntFromInterval(70, 100)
    let trigger = randomIntFromInterval(1,3);
    let battery = randomIntFromInterval(20,100)
    let bps = randomIntFromInterval(90, 150)
    let bpd = randomIntFromInterval(40, 100)
    let bodyTemp = randomIntFromInterval(25, 45)

    return {heartRate, spo2, trigger, battery, bps, bpd, bodyTemp}
}

//Returns triggers based in vitals recieved from device
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
    
    socket.on('subscribeOnePatient', (payload)=>{
        console.log('Single', payload)
        //payload : {userId, role, patientId, MAC} should be payload structure

        if(!payload) {
            socket.emit('error', ERROR.NO_PAYLOAD_FOUND)
            socket.disconnect()
            return;
        } 

        if(!payload.patientId){
            socket.emit('error', ERROR.INVALID_PAYLOAD_STRUCTURE)
            socket.disconnect()
            return;
        } 

        if(!payload.MAC){
            socket.emit('error', ERROR.INVALID_PAYLOAD_STRUCTURE)
            socket.disconnect()
            return;
        } 
        else{
            //Dummy Data

            let interval = setInterval(()=> {

                let data = {
                    userId : payload.userId, 
                    role: payload.role, 
                    patientId : payload.patientId,
                    MAC : payload.MAC
                }

                let vitals = getDummyVitals()
                let triggers = checkTriggers(vitals)

                data = {...data, ...vitals, triggers}
                console.log('data', data)
                socket.emit('DATA_LIVE_SINGLE', data)

            }, 5000)
            socket.on('disconnect', ()=>{
                clearInterval(interval)
                console.log('Demo data stopped!')
            })
        }

        // client.on('message', (topic, message)=>{
        //     // payload.MACS.forEach(MAC => {
        //     //     console.log({MAC: MAC, ...JSON.parse(message)})
        //     // })
        //     let triggers = checkTriggers(JSON.parse(message))
        //     socket.emit('liveData', {...JSON.parse(message), triggers})
        //     console.log('emitted')
        // })
    })

    socket.on('subscribeMultiplePatients', (payload)=>{
        console.log('Multiple', payload)
        //payload : {userId, role, patients:[{paitnetId,MAC}]} should be payload structure

        if(!payload) {
            socket.emit('error', ERROR.NO_PAYLOAD_FOUND)
            socket.disconnect()
            return;
        } 
    
        if(!payload.patients){
            socket.emit('error', ERROR.INVALID_PAYLOAD_STRUCTURE)
            socket.disconnect()
            return;
        } 

        if(payload.patients.length === 0){
            socket.emit('error', ERROR.PAYLOAD_EMPTY)
            socket.disconnect()
            return;
        }
        else{
            //Dummy Data

            let interval = setInterval(()=> {

                let data = {
                    userId : payload.userId, 
                    role: payload.role, 
                    patients:[]
                }
    
                payload.patients.forEach(patient => {

                    if(patient.patientId && patient.MAC){
                        
                        let vitals = getDummyVitals()
                        let triggers = checkTriggers(vitals)
                        let finalPatientData = {
                            patientId : patient.patientId, 
                            MAC: patient.MAC, 
                            ...vitals, 
                            triggers
                        }
                        data.patients.push(finalPatientData)
                    }
                })

                socket.emit('DATA_LIVE_MULTIPLE', data)

            }, 5000)
            socket.on('disconnect', ()=>{
                clearInterval(interval)
                console.log('Demo data stopped!')
            })

            //Data from MQTT client
            // client.on('message', (topic, message)=>{
            //     // payload.MACS.forEach(MAC => {
            //     //     console.log({MAC: MAC, ...JSON.parse(message)})
            //     // })
            //     let triggers = checkTriggers(JSON.parse(message))
            //     socket.emit('liveData', {...JSON.parse(message), triggers})
            //     console.log('emitted')
            // })
        }

    })

    socket.on('disconnect', () =>  {
        console.log(`Client Disconnected From Monitoring Station - ${socket.id}`)
    })
})


server.listen(5000, ()=> console.log('Server listening @ PORT - 5000'))