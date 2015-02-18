var url = require("url"),
	path = require("path"),
	fs = require("fs"),
	os = require("os"),
	view = require("../view/view.js");

exports.fileGetCallback = function (req, res) {
	var uri = url.parse(req.url).pathname;
	var filePath = path.join(StorageAccessor.getStoragePath(), uri);

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

var sendDirectoryView = function (dirPath, res) {
	console.log("dirPath = " + dirPath);
	StorageAccessor.getStatOfDirContents(dirPath, function (fileStatses) {
		files = fileStatses.map(function (fileStats) {
			return fileStats.file +
				(fileStats.stats.isDirectory() ? '/' : '');
		});

		sendFileListView(res, files);
	});
}

exports.getStatOfDirContents = function (dirPath, callback) {
	fs.readdir(dirPath, function (err, files) {
		// this code can be refactored using promises
		var absolutePaths = files.map(function (file) {
			return path.join(dirPath, file);
		});

		getStatOfFiles(absolutePaths, function (statses) {
			var fileStatses = files.map(function (_, i)  {
				return {file: files[i], stats: statses[i]};
			});

			callback(fileStatses);
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

exports.getStoragePath = function () {
    var storageDir = 'storage';

    try {
        fs.mkdirSync(storageDir);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err.code;
        }
    }

	return path.join(process.cwd(), storageDir);
}

var sendFileListView = function (res, files) {
	res.send(view.renderFileList(files));
}
