var fs = require('fs'),
    plainConfig = require('../model/plain-config.js');

var configFilename = {
    hostapd: '/etc/hostapd/hostapd.conf'
}

exports.syncHostapd = function (config, callback) {
    plainConfig.read(configFilename.hostapd, function (err, params) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }

        params.ssid = config.APPSSID;
        params.wpa_passphrase = config.APPNETWORKKEY;

        plainConfig.write(configFilename.hostapd, params, function (err) {
            if (err) {
                console.log(err);
                callback(err);
                return;
            }

            console.log("updated hostapd config");
            callback(null);
        });
    });
}
