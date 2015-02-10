var url = require("url"),
	path = require("path"),
	fs = require("fs"),
	os = require("os"),
	view = require("../view/view.js");

var fileGetCallback = function (req, res) {
	var uri = url.parse(req.url).pathname;
	var filePath = path.join(getStoragePath(), uri);

	console.log("req.url = " + req.url + ", pathname = " + uri);

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
		// this code can be refactored using promises
		var numWaiting = files.length;

		var addPathSuffix = function (index) {
			console.log("filePath = " + filePath);
			console.log("files[" + index + "] = " + files[index]);
			var absolutePath = path.join(filePath, files[index]);
			fs.stat(absolutePath, function (err, stats) {
				if (err) {
					console.log(err);
				}

				if (stats.isDirectory()) {
					files[index] += '/';
				}

				if (--numWaiting == 0) {
					var dir = path.relative(getStoragePath(), filePath);
					res.send(view.renderFileList(dir, files));
				}
			});
		}

		for (var i = 0; i < files.length; i++) {
			addPathSuffix(i);
		}
	});
}

var getStoragePath = function () {
	return path.join(process.cwd(), "storage");
}

StorageAccessor = {};
StorageAccessor.fileGetCallback = fileGetCallback;

module.exports = StorageAccessor;