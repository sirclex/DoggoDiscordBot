const fs = require('fs');
module.exports = function (msg) {
    let dateOb = new Date();
    let string = dateOb + ": " + msg;
    console.log(string);
    fs.appendFile('../doggo.log', string + "\n", function (err) {
        if (err) throw err;
    });
}