const fs = require('fs');

module.exports = function () {
    return Number(fs.readFileSync('./Total_Weather_Calls.txt', 'utf8'));
}