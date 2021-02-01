const fs = require('fs');
const TextProcess = require('./text-processing');

console.log(Number(fs.readFileSync('../totalC.txt', 'utf8')));
var string = "t k biet, m biet k, chu t k";

string = TextProcess.normalizeAll(string);
console.log(string);
