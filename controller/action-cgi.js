var fs = require("fs"),
    config = require("../model/config.js"),
    ble = require("../network/ble.js"),
    wifi = require("../network/wifi.js"),
    child_process = require("child_process"); 

function Action(code, func, params) {
    this.code = code;
    this.func = func;
    this.params = params;
}

var actions = [
    new Action('RESTART_NETWORK', restartNetwork, null),
    new Action('SET_BLE_NAME', config.paramSetter('BLE_NAME'), [ 'value' ]),
    new Action('GET_BLE_NAME', config.paramGetter('BLE_NAME'), null),
    new Action('SET_BLE_SERVICE_UUID', config.paramSetter('BLE_SERVICE_UUID'), [ 'value' ]),
    new Action('GET_BLE_SERVICE_UUID', config.paramGetter('BLE_SERVICE_UUID'), null),
    new Action('ENABLE_BLE', ble.enableAdvertising, null),
    new Action('DISABLE_BLE', ble.disableAdvertising, null),

    new Action('TURN_ON_WIFI', wifi.turnOn, null),
    new Action('TURN_OFF_WIFI', wifi.turnOff, null),
    new Action('NUM_CONNECTED_WIFI_STA', showConnectedDeviceCount, null)
];

exports.actionExecutionCallback = function (req, res) {
    var query = req.query;
    var code = query.code;

    if (!code) {
        console.log("code is not specified as a query string");
        res.sendStatus(404);
        return;
    }

    var action = actions.filter(function (x) {
        return (x.code == code);
    })[0];

    if (action == undefined) {
        console.log("action(code=" + op + ") is not defined");
        res.sendStatus(404);
        return;
    }

    if (action.params) {
        var allQueriesExist = action.params.reduce(function (accum, param) {
            return accum && (param in query);
        }, true);

        if (!allQueriesExist) {
            console.log("one or more missing query strings");
            res.sendStatus(404);
            return;
        }
    }

    res.contentType('text/plain');

    action.func(query, function(err, message) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        res.send(message);
    });
}

function restartNetwork(callback) {
    child_process.exec("systemctl restart hostapd",
        function (err, stdout, stderr) {
            callback(err);
    }); 
}

function showConnectedDeviceCount(query, callback) {
    var count = wifi.countConnectedStations();
    callback(null, count.toString());
}
