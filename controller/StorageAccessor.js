var url = require("url"),
	path = require("path"),
	fs = require("fs"),
	os = require("os"),
	view = require("../view/view.js");

StorageAccessor = {};

StorageAccessor.fileGetCallback = function (req, res) {
	var uri = url.parse(req.url).pathname;
	var filePath = path.join(getStoragePath(), uri);

	console.log("req.url = " + req.url + ", pathname = " + uri);

	fs.stat(filePath, function (err, stats) {
		if (err) {
			if (err.code == "ENOENT") {
				console.log("no such file '" + filePath + "'");
				res.sendStatus(404);
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
		// this code can be refactored using promises
		var absolutePaths = files.map(function (file) {
			return path.join(filePath, file);
		});

		getStatOfFiles(absolutePaths, function (statses) {
			for (var i = 0; i < files.length; i++) {
				if (statses[i].isDirectory()) {
					files[i] += '/';
				}
			}

			sendFileListView(res, filePath, files);
		});
	});
}

var getStatOfFiles = function (filePaths, callback) {
	var numWaiting = filePaths.length;
	var statses = [];

	if (numWaiting == 0) {
		callback(statses);
	}

	filePaths.forEach( function (filePath) {
		fs.stat(filePath, function (err, stats) {
			if (err) {
				console.log(err);
			}

			statses.push(stats);

			if (--numWaiting == 0) {
				callback(statses);
			}
		});
	});
}

var getStoragePath = function () {
	return path.join(process.cwd(), "storage");
}

var sendFileListView = function (res, filePath, files) {
	var dir = path.relative(getStoragePath(), filePath);
	res.send(view.renderFileList(dir, files));
}

module.exports = StorageAccessor;