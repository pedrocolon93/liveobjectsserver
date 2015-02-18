var fs = require('fs'),
    plainConfig = require('../model/plain-config.js');

var configFilename = {
    hostapd: '/etc/hostapd/hostapd.conf'
}

exports.syncHostapd = function (config, callback) {
    try {
        checkIfFileExists(configFilename.hostapd);
    } catch (err) {
        callback(err);
        return;
    }

    plainConfig.read(configFilename.hostapd, function (err, params) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }

        params.ssid = config.APPSSID;
        params.wpa_passphrase = config.APPNETWORKKEY;

        plainConfig.write(configFilename.hostapd, function (err) {
            if (err) {
                console.log(err);
                callback(err);
            }

            console.log("updated hostapd config");
            callback(null);
        });
    });
}

function checkIfFileExists(filename) {
    try {
        var fileStat = fs.statSync(filename);
        if (!isFile) {
            throw filename + " must be a file";
        }
    } catch (err) {
        console.log(filename + " doesn't exist");
        throw err;
    }
}
