var child_process = require("child_process");

exports.turnOn = function(query, callback) {
    // not implemented yet
}

exports.turnOff = function(query, callback) {
    // not implemented yet
}

exports.countConnectedStations = function() {
    var buffer = child_process.execSync("iw dev wlan0 station dump | grep ^Station | wc -l");
    var numConnectedStations = parseInt(buffer.toString());

    return numConnectedStations;
}
