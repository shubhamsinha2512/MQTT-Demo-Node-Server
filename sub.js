const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://122.160.15.59')

client.on('connect', ()=>{
    client.subscribe('details', (err)=>{
        if(!err) console.log('Subscribed Successfully!')
    })
})

client.on('message', (topic, message)=>{
    console.log(JSON.parse(message))
})