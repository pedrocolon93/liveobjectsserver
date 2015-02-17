var fs = require('fs');
var os = require('os');

var plainConfig = {};

plainConfig.read = function (filename, callback) {
    fs.readFile(filename, function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
        }

        var lines = data.toString().split(/\r\n|\n|\r/).filter(function (line) {
            return line !== '';
        });

        var params = {};
        lines.forEach(function (line) {
            var keyValue = line.split(/\s*=\s*/);
            params[keyValue[0]] = keyValue[1];
        });

        callback(err, params);
    });
}
    
plainConfig.write = function (filename, data, callback) {
    var lines = '';

    Object.keys(data).forEach(function (param) {
        lines += param + '=' + data[param] + os.EOL;
    });

    fs.writeFile(filename, lines, function (err) {
        if (err) {
            console.log(err);
        }

        callback(err);
    });
}

module.exports = plainConfig;
