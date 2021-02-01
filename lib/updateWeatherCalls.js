const fs = require('fs');
const writeLog = require('../lib/writeLog');
module.exports = function (weatherCalls) {
    fs.writeFileSync('./Total_Weather_Calls.txt', weatherCalls.toString());
    writeLog("weatherCalls >> Total_Weather_Calls.txt");
}