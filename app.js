const app =  require('express')()
const server = require('http').createServer(app)

const mqtt = require('mqtt')


const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
})


io.on('connection', (socket)=>{

    const client = mqtt.connect('mqtt://122.160.15.59')
    client.on('connect', ()=>{
        client.subscribe('details', (err)=>{
            if(!err) console.log('Subscribed to MQTT Successfully!')
        })
    })
    
    let data;

    client.on('message', (topic, message)=>{
        // data = {...message}
        console.log(JSON.parse(message))
        socket.emit('liveData', JSON.parse(message))
        console.log('emitted')
    })

})


server.listen(5000, ()=> console.log('Server listening @ PORT - 5000'))