var url = require("url"),
	path = require("path"),
	fs = require("fs"),
	os = require("os"),
	multiparty = require("multiparty"),
	StorageAccessor = require("./StorageAccessor.js");
	commandResponse = require("../view/commandResponse.js");
	view = require("../view/view.js");

command = {};

var commands = {
	'100' : { func: getFileList, params: [ "DIR" ] },
	'101' : { func: getNumFiles, params: null }
};

command.commandExecutionCallback = function (req, res) {
	var query = req.query;
	var op = query.op;

	console.log(query);

	if (!op) {
		console.log("op is not specified as a query string");
		res.sendStatus(404);
		return;
	}

	var allQueriesExist = commands[op].params.reduce(function (accum, param) {
		return accum && (param in query);
	}, true);

	if (!allQueriesExist) {
		console.log("one or more missing query strings");
		res.sendStatus(404);
		return;
	}

	res.contentType('text/plain');

	commands[op].func(query, function (message) {
		res.send(message);
	});
}

function getFileList (query, callback) {
	var absoluteDir = path.join(StorageAccessor.getStoragePath(), query.DIR);
	console.log("query string: dir=" + absoluteDir);

	StorageAccessor.getStatOfDirContents(absoluteDir, function (fileStatses) {
		var fileList = commandResponse.createFileList(query.DIR, fileStatses);
		callback(fileList);
	});
}

function getNumFiles (query, callback) {
	callback("placeholder");
}

module.exports = command;
