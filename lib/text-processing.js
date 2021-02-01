const propertiesReader = require('properties-reader');
const normalizePro = propertiesReader('./normalize_string.properties');

function normalizeAll(arguments) {
    var string = arguments;
    normalizePro.each((key, value) => {
        string = normalize(string, key, value);
    });
    return string;
}

function normalize(arguments, string1, string2) {
    var string = arguments;
    if (string.startsWith(string1 + " ")) {
        string = string.substring(string1.length + 1);
        string = string2 + " " + string;
    }

    if (string.endsWith(" " + string1)) {
        string = string.substring(0, string.length - string1.length);
        string = string + string2;
    }

    if (string == string1) {
        string = string2;
    }
    string = string.replace(" " + string1 + " ", " " + string2 + " ");
    return string;
}

module.exports = {normalizeAll}