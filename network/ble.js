var bleno = require('bleno');
var configModel = require('../model/config.js');

exports.enableAdvertising = function(query, callback) {
    loadBleConfig(function(err, bleConfig) {
        if (err) {
            callback(err);
        }

        console.log('starting BLE advertising');
        var name = bleConfig.BLE_NAME;
        var serviceUuids = [ bleConfig.BLE_SERVICE_UUID ];
        console.log('name = ' + name + ', serviceUuids = ' + serviceUuids);
        bleno.startAdvertising(name, serviceUuids, function() {
            callback(null, 'success');
        });
    });
}

exports.disableAdvertising = function(query, callback) {
    console.log('stopping BLE advertising');
    bleno.stopAdvertising(function() {
        callback(null, 'success');
    });
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
