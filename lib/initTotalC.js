const fs = require('fs');

module.exports = function () {
    return Number(fs.readFileSync('./totalC.txt', 'utf8'));
}