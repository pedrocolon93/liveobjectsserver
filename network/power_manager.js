var ble = require('./ble.js');
var wifi = require('./wifi.js');
var bleno = require('bleno');

var idle_monitor = null;
var TASK_INTERVAL = 3000;
var SLEEP_INTERVAL = 180000;
var idle_time = 0;

exports.enable = function(query, callback) {
    switchToSleep();

    bleno.on('accept', function(clientAddress) {
        switchToActive();
        registerIdleMonitor();
    });

    callback(null, "success");
}

exports.disable = function(query, callback) {
    switchToActive();

    clearInterval(idle_monitor);
    bleno.removeAllListeners('accept');

    callback(null, "success");
}

function enableBle() {
    ble.enableAdvertising(null, function(error, message) {
        if (error) {
            console.log(error);
            return;
        }
    });
}

function disableBle() {
    ble.disableAdvertising(null, function(error, message) {
        if (error) {
            console.log(error);
            return;
        }
    });
}

function enableWifi() {
    wifi.turnOn(null, function(error, message) {
        if (error) {
            console.log(error);
            return;
        }
    });
}

function disableWifi() {
    wifi.turnOff(null, function(error, message) {
        if (error) {
            console.log(error);
            return;
        }
    });
}

function switchToActive() {
    disableBle();
    enableWifi();
}

function switchToSleep() {
    enableBle();
    disableWifi();

}

function registerIdleMonitor() {
    idle_time = 0;
    idle_monitor = setInterval(function() {
        idle_time += TASK_INTERVAL;
        if (idle_time > SLEEP_INTERVAL) {
            switchToSleep();
            clearInterval(idle_monitor);
        }
    }, TASK_INTERVAL);
}
