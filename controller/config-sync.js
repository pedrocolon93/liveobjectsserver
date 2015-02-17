var plainConfig = require('../model/plain-config.js')

var configSync = {};
var configFilename = {
    hostapd: '/etc/hostapd/hostapd.conf'
}

configSync.syncHostapd = function (err, config) {
    checkIfFileExists(configFilename.hostApd);

    plainConfig.read(configFilename.hostApd, function (err, params) {
        if (err) {
            console.log(err);
            callback(err);
        }

        params.ssid = config.APPSSID;
        params.wpa_passphrase = config.APPNETWORKKEY;

        plainConfig.write(configFilename.hostApd, function (err) {
            if (err) {
                console.log(err);
                callback(err);
            }

            console.log("updated hostapd config");
            callback(null);
        }
    });
}

function checkIfFileExists(filename) {
    try {
        var fileStat = fs.statSync(configFilename.hostApd);
        if (!isFile) {
            throw configFilename.hostApd + " must be a file";
        }
    } catch {
        console.log(configFilename.hostApd + " doesn't exist");
        throw err;
    }
}

module.exports = configSync;
