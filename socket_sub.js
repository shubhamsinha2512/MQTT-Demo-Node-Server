const io = require('socket.io-client').io
const socket = io.connect('http://localhost:5000')

socket.on('liveData', (data)=>{
    console.log(JSON.parse(data))
})