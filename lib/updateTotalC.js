const fs = require('fs');
const writeLog = require('../lib/writeLog');
module.exports = function (totalC) {
    fs.writeFileSync('./totalC.txt', totalC.toString());
    writeLog("totalC >> totalC.txt");
}