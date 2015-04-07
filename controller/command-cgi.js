var url = require("url"),
    path = require("path"),
    fs = require("fs"),
    os = require("os"),
    multiparty = require("multiparty"),
    StorageAccessor = require("./StorageAccessor.js");
    commandResponse = require("../view/commandResponse.js");
    view = require("../view/view.js"),
    config = require("../model/config.js");

var commands = [
    { desc: 'get file list',
        op: 100, func: getFileList, params: [ "DIR" ] },
    { desc: 'get num files',
        op: 101, func: getNumFiles, params: [ "DIR" ] },
    { desc: 'is updated',
        op: 102, func: isUpdated, params: null },
    { desc: 'get APPSSID',
        op: 104, func: configParamGetter('APPSSID'), params: null },
    { desc: 'get APPNETWORKKEY',
        op: 105, func: configParamGetter('APPNETWORKKEY'), params: null },
    { desc: 'get client MAC addr',
        op: 106, func: getClientMacAddress, params: null },
//  '107' not implemented
    { desc: 'get VERSION',
        op: 108, func: configParamGetter('VERSION'), param: null },
//  '109' not implemented
    { desc: 'get APPMODE',
        op: 110, func: configParamGetter('APPMODE'), param: null },
    { desc: 'get APPAUTOTIME',
        op: 111, func: configParamGetter('APPAUTOTIME'), param: null },
    { desc: 'get APPINFO',
        op: 117, func: configParamGetter('APPINFO'), param: null },
    { desc: 'get UPLOAD',
        op: 118, func: configParamGetter('UPLOAD'), param: null }
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
