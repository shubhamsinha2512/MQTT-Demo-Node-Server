const io = require('socket.io-client').io
const socket = io.connect('http://localhost:5000/monitoringstation')

socket.emit('subscribe',{userId:1, role:1, MACS:[1234, 4321, 3124, 4431]})
socket.on('liveData', (data)=>{
    console.log(data)
})