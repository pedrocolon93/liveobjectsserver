var bleno = require('bleno');
var configMode = require('../model/config.js');

exports.enableAdvertising = function(callback) {
    loadConfig(function(err, bleConfig) {
        if (err) {
            callback(err);
        }

        console.log('starting BLE advertising');
        var name = bleConfig.BLE_NAME;
        var serviceUuids = [ bleConfig.BLE_SERVICE_UUID ];
        console.log('name = ' + name + ', serviceUuids = ' + serviceUuids);
        bleno.startAdvertising(name, serviceUuids, callback);
    });
}

exports.disableAdvertising = function(callback) {
    console.log('stopping BLE advertising');
    bleno.stopAdvertising(callback);
}

function loadBleConfig(callback) {
    configModel.getConfig(function(err, config) {
        if (err) {
            callback(err);
            return;
        }

        callback(null, {'BLE_NAME': config.BLE_NAME, 'BLE_SERVICE_UUID': config.BLE_SERVICE_UUID});
    });
}
