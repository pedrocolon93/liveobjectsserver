var url = require("url"),
	path = require("path"),
	fs = require("fs"),
	os = require("os"),
	view = require("../view/view.js");

var fileGetCallback = function (req, res) {
	var uri = url.parse(req.url).pathname;
	var filePath = path.join(process.cwd(), "storage", uri);

	fs.stat(filePath, function (err, stats) {
		if (err) {
			if (err.code == "NOENT") {
				res.send("file doesn't exist " + filePath);
			} else {
				console.log(err);
			}
		} else if (stats.isFile()) {
			sendFile(filePath, res);
		} else if (stats.isDirectory()) {
			sendDirectoryView(filePath, res);
		} else {
			res.send("unknown file type " + filePath);
		}
	});
};

var sendFile = function (filePath, res) {
	res.sendFile(filePath, null, function (err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		} else {
			console.log("Sent:", filePath);
		}
	});
}

var sendDirectoryView = function (filePath, res) {
	console.log("the file is a directory " + filePath);

	fs.readdir(filePath, function (err, files) {
		res.send(view.renderFileList(files));
	});
}

StorageAccessor = {};
StorageAccessor.fileGetCallback = fileGetCallback;

module.exports = StorageAccessor;