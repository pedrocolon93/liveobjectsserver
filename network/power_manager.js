var ble = require('./ble.js');
var wifi = require('./wifi.js');
var bleno = require('bleno');

var idle_monitor = null;
var TASK_INTERVAL = 3000;
var SLEEP_INTERVAL = 180000;
var idle_time = 0;

exports.enable = function(query, callback) {
    console.log("power_manager.enable()");
    switchToSleep();

    bleno.on('accept', function(clientAddress) {
        switchToActive();
        registerIdleMonitor();
    });

    callback(null, "success");
}

exports.disable = function(query, callback) {
    console.log("power_manager.disable()");
    switchToActive();

    clearInterval(idle_monitor);
    bleno.removeAllListeners('accept');

    callback(null, "success");
}

function enableBle() {
    console.log("power_manager.enableBle()");
    ble.enableAdvertising(null, function(error, message) {
        if (error) {
            console.log(error);
            return;
        }
    });
}

function disableBle() {
    console.log("power_manager.disableBle()");
    ble.disableAdvertising(null, function(error, message) {
        if (error) {
            console.log(error);
            return;
        }
    });
}

function enableWifi() {
    console.log("power_manager.enableWifi()");
    wifi.turnOn(null, function(error, message) {
        if (error) {
            console.log(error);
            return;
        }
    });
}

function disableWifi() {
    console.log("power_manager.disableWifi()");
    wifi.turnOff(null, function(error, message) {
        if (error) {
            console.log(error);
            return;
        }
    });
}

function switchToActive() {
    console.log("power_manager.switchToActive()");
    disableBle();
    enableWifi();
}

function switchToSleep() {
    console.log("power_manager.switchToSleep()");
    enableBle();
    disableWifi();

}

function registerIdleMonitor() {
    console.log("power_manager.registerIdleMonitor()");
    idle_time = 0;
    idle_monitor = setInterval(function() {
        console.log("power_manager.idle_monitor(" + idle_time + "/" + SLEEP_INTERVAL + ")");
        idle_time += TASK_INTERVAL;
        if (idle_time > SLEEP_INTERVAL) {
            switchToSleep();
            clearInterval(idle_monitor);
        }
    }, TASK_INTERVAL);
}
