var url = require("url"),
	path = require("path"),
	fs = require("fs"),
	os = require("os"),
	multiparty = require("multiparty"),
	StorageAccessor = require("./StorageAccessor.js");
	commandResponse = require("../view/commandResponse.js");
	view = require("../view/view.js");

configCgi = {};

var commands = [
    { queries: [ 'APPAUTOTIME', 'APPMODE' ], func: setConnectionTimeout },
    { queries: [ 'APPINFO' ], func: setAppSpecificData }
];

configCgi.configExecutionCallback = function (req, res) {
	var query = req.query;
	var masterCode = query.MASTERCODE;

	console.log(query);

	if (!masterCode) {
		console.log("config commands require the query string 'MASTERCODE'");
		res.sendStatus(404);
		return;
	}

    for (var i = 0; i < commands.length; i++) {
        var allQueriesExist = commands[i].queries.reduce(function (accum, param) {
            return accum && (param in query);
    }, true);
        

        if (allQueriesExist) {
            res.contentType('text/plain');
            commands[i].func(query, function (succeeded) {
                res.send(succeeded ? 'SUCCESS' : 'ERROR');
            });

            return;
        }
    }
}

function setConnectionTimeout (query, callback) {
    callback(false);
}

function setAppSpecificData (query, callback) {
    callback(false);
}

module.exports = configCgi;
