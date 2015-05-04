var url = require("url"),
    path = require("path"),
    fs = require("fs"),
    os = require("os"),
    multiparty = require("multiparty"),
    StorageAccessor = require("./StorageAccessor.js");
    commandResponse = require("../view/commandResponse.js");
    view = require("../view/view.js"),
    config = require("../model/config.js");

function Command(desc, op, func, params) {
    this.desc = desc;
    this.op = op;
    this.func = func;
    this.params = params;
}

var commands = [
    new Command('get file list', 100, getFileList, [ "DIR" ]),
    new Command('get num files', 101, getNumFiles, [ "DIR" ]),
    new Command('is updated', 102, isUpdated, null),
    new Command('get APPSSID', 104, configParamGetter('APPSSID'), null),
    new Command('get APPNETWORKKEY', 105, configParamGetter('APPNETWORKKEY'), null),
    new Command('get client MAC addr', 106, getClientMacAddress, null),
//  '107' not implemented
    new Command('get VERSION', 108, configParamGetter('VERSION'), null),
//  '109' not implemented
    new Command('get APPMODE', 110, configParamGetter('APPMODE'), null),
    new Command('get APPAUTOTIME', 111, configParamGetter('APPAUTOTIME'), null),
    new Command('get APPINFO', 117, configParamGetter('APPINFO'), null),
    new Command('get UPLOAD', 118, configParamGetter('UPLOAD'), null)
// '120' not implemented
// '121' not implemented
// '130' not implemented
// '131' not implemented
// '140' not implemented
// '190' not implemented
// '200' not implemented
// '201' not implemented
// '202' not implemented
// '203' not implemented
];

exports.commandExecutionCallback = function (req, res) {
    var query = req.query;

    if (Object.keys(query).length == 0) {
        displayCommandTestPage(res);
    } else {
        processQuery(query, res);
    }
}

function displayCommandTestPage(res) {
    res.contentType('text/html');
    res.send(view.renderCommandTestPage(commands));
}

function processQuery (query, res) {
    var op = query.op;

    console.log(query);
    if (!op) {
        console.log("op is not specified as a query string");
        res.sendStatus(404);
        return;
    }

    var command = commands.filter(function (x) {
        return (x.op == op);
    })[0];

    if (command == undefined) {
        console.log("command(op=" + op + ") is not defined");
        res.sendStatus(404);
        return;
    }

    if (command.params) {
        var allQueriesExist = command.params.reduce(function (accum, param) {
            return accum && (param in query);
        }, true);

        if (!allQueriesExist) {
            console.log("one or more missing query strings");
            res.sendStatus(404);
            return;
        }
    }

    res.contentType('text/plain');

    command.func(query, function (err, message) {
        if (err) {
            console.log("failed to execute the command (op=" + op + ")");
            res.sendStatus(500);
            return;
        }

        res.send(message);
    });
}

function getFileList (query, callback) {
    var absoluteDir = path.join(StorageAccessor.getStoragePath(), query.DIR);
    console.log("query string: dir=" + absoluteDir);

    StorageAccessor.getStatOfDirContents(absoluteDir, function (fileStatses) {
        var fileList = commandResponse.createFileList(query.DIR, fileStatses);
        callback(null, fileList);
    });
}

function getNumFiles (query, callback) {
    var absoluteDir = path.join(StorageAccessor.getStoragePath(), query.DIR);

    StorageAccessor.getStatOfDirContents(absoluteDir, function (fileStatses) {
        callback(null, fileStatses.length.toString());
    });
}

function isUpdated (query, callback) {
    // always returns 0 ('not updated')
    callback(null, '0');
}

function getClientMacAddress (query, callback) {
    callback(null, 'aabbccddeeff'); // placeholder
}

function configParamGetter (paramName) {
    return function (query, callback) {
        config.getConfig(function (err, config) {
            if (err) {
                callback(err);
            }

            callback(null, config[paramName]);
        });
    };
}
