const io = require('socket.io-client').io
const socket = io.connect('http://localhost:5000/monitoringstation')

// socket.emit('subscribeOnePatient',{userId:1, role:1, patientId : 5, MAC:'AX5N4'})

// socket.on('DATA_LIVE_SINGLE', (data)=>{
//     console.log(data)
// })

socket.emit('subscribeMultiplePatients',{userId:1, role:1, patients: [{patientId : 5, MAC:'AX5N4'},{patientId : 2, MAC:'ZBR54'},{patientId : 1, MAC:'MHZ6T'},]})

socket.on('DATA_LIVE_MULTIPLE', (data)=>{
    // console.log(data.patients[0].triggers)
    console.log(data)
})

socket.on('error', (err)=>console.log(err))