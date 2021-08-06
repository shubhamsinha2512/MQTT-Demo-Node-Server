var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://122.160.15.59')
var topicList = ['elivband/#'];

const isLoop = false;
const delay = 5000;
const isRandom = true;

let heartRate;
let spo2;
let trigger;
let battery;
let bps;
let bpd;
let bodyTemp;
let rawData;
let gatewayCommand;


// if (isLoop) {

//   setInterval(() => {
//     generateDummyValues();
//     client.publish('elivband', JSON.stringify(gatewayCommand))
//   }, delay);

// } else {
//   generateDummyValues();
//   client.publish('elivband', JSON.stringify(gatewayCommand))
// }

function generateDummyValues() {

  if (!isRandom) {
    heartRate = 50 //60 - 100 normal 
    spo2 = 80;
    trigger = 00;
    battery = 90;
    bps = 60;
    bpd = 110;
    bodyTemp = 100;
  } else {
    heartRate = randomIntFromInterval(60, 100) //60 - 100 normal 
    spo2 = randomIntFromInterval(70, 100)
    trigger = 00;
    battery = 90
    bps = randomIntFromInterval(90, 150)
    bpd = randomIntFromInterval(40, 100)
    bodyTemp = randomIntFromInterval(25, 45)
  }

  console.log(" Heart Rate: ", heartRate);
  console.log(" Spo2: ", spo2);
  console.log(" Bps", bps);
  console.log(" Bpd", bpd);
  console.log(" Body Temp", bodyTemp)

  rawData = "0201040BFF00001A"
  rawData += (heartRate.toString(16).toUpperCase().padStart(2, "0"));
  rawData += (spo2.toString(16).toUpperCase().padStart(2, "0"));
  rawData += (trigger.toString(16).toUpperCase().padStart(2, "0"));
  rawData += (battery.toString(16).toUpperCase().padStart(2, "0"));
  rawData += (bps.toString(16).toUpperCase().padStart(2, "0"));
  rawData += (bpd.toString(16).toUpperCase().padStart(2, "0"));
  rawData += (bodyTemp.toString(16).toUpperCase().padStart(2, "0"));
  // console.log(rawData);



  gatewayCommand = [
    {
      "timestamp": "2021-05-05T10:32:25.260Z",
      "surya": "pratap",
      "type": "Gateway",
      "mac": "AC233FC08DAC",
      "gatewayFree": 91,
      "gatewayLoad": 1.18
    },
    {
      "timestamp": "2021-05-05T10:32:26.172Z",
      "type": "Unknown",
      "mac": "SURYA888",
      "bleName": false, "rssi": -45, "rawData": rawData
    }]

}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

client.on('connect', ()=>{
  setInterval(()=>{
    generateDummyValues()
    // client.publish("details", `HR=${heartRate}, BPD=${bpd}, BPS=${bps}, SPO2=${spo2}, BODY_TEMP=${bodyTemp}, Battery=${battery}, Trigger=${trigger}`)
    client.publish("details", 
      JSON.stringify({
        heartRate,
        bpd,
        bps,
        spo2,
        battery,
        bodyTemp,
        trigger
      })
    )
  }, delay)
})

// console.log("Listening to events");
// client.on('connect', function () {
//   client.subscribe('elivband/#', function (err) {
//     if (!err) {
//       console.log("Subscribed Successfully")
//     }
//   })
// })

// client.on('message', function (topic, message) {
//   // message is Buffer
//   let array = new Uint8Array(message);
// 		var result = "";
// 		for (var i = 0; i < array.length; ++i) {
// 			result += (String.fromCharCode(array[i]));
// 		}
//    console.log("Message : " ,result);
// })

