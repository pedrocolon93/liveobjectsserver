var child_process = require("child_process");

exports.turnOn = function(query, callback) {
    toggleHostApd(true, callback);
}

exports.turnOff = function(query, callback) {
    toggleHostApd(false, callback);
}

exports.countConnectedStations = function() {
    var buffer = child_process.execSync("iw dev wlan0 station dump | grep ^Station | wc -l");
    var numConnectedStations = parseInt(buffer.toString());

    return numConnectedStations;
}

function toggleHostApd(turn_on, callback) {
    var command = (turn_on ? 'start' : 'stop');

    child_process.exec("systemctl " + command + " hostapd.service", function(err, stdout, stderr) {
        callback(null, "success");
    });
}
