var url = require("url"),
	path = require("path"),
	fs = require("fs"),
	os = require("os"),
	view = require("../view/view.js")
    q = require("q");

exports.fileGetCallback = function (req, res) {
	var uri = url.parse(req.url).pathname;
	var filePath = path.join(exports.getStoragePath(), uri);

	console.log("req.url = " + req.url + ", pathname = " + uri);

    fsStatPromised(filePath)
    .then(function (stats) {
   		if (stats.isFile()) {
			sendFile(filePath, res);
		} else if (stats.isDirectory()) {
			sendDirectoryView(filePath, res);
		} else {
			res.send("unknown file type " + filePath);
		}
    })
    .catch(function (error) {
		if (error.code == "ENOENT") {
            console.log("no such file '" + filePath + "'");
            res.sendStatus(404);
        } else {
            console.log(error);
        }
    });
};

var sendFile = function (filePath, res) {
	res.sendFile(filePath, null, function (err) {
		if (err) {
			res.status(err.status).end();
		} else {
			console.log("Sent:", filePath);
		}
	});
}

var sendDirectoryView = function (dirPath, res) {
	console.log("dirPath = " + dirPath);
	exports.getStatOfDirContents(dirPath)
    .then(function (fileStatses) {
		files = fileStatses.map(function (fileStats) {
			return fileStats.file +
				(fileStats.stats.isDirectory() ? '/' : '');
		});

		sendFileListView(res, files);
	});
}

exports.getStatOfDirContents = function (dirPath) {
    var deferred = q.defer();

	fsReaddirPromised(dirPath)
    .then(function (files) {
		// this code can be refactored using promises
		var absolutePaths = files.map(function (file) {
			return path.join(dirPath, file);
		});

        return absolutePaths;
    })
    .then(getStatOfFiles)
    .then(function(statses) {
        statses.map(function(stats) {
            return stats['file'] = path.basename(stats['file']);
        });
        deferred.resolve(statses);
	})	
    .catch(function(error) {
        deferred.reject(error);
    });

    return deferred.promise;
}

var getStatOfFiles = function (filePaths) {
    var deferred = q.defer();

	if (filePaths.length == 0) {
        deferred.resolve(statses);
        return deferred.promise;
	}

    var statses = [];

    q.all(filePaths.map(fsStatPromised))
    .then(function (stats) {
        for (var i = 0; i < filePaths.length; i++) {
            statses.push({file: filePaths[i], stats: stats[i]});
        }

		deferred.resolve(statses);
    })
    .catch(deferred.reject);

    return deferred.promise;
}

exports.getStoragePath = function () {
    var storageDir = path.join(__dirname, '..', 'storage');

    try {
        fs.mkdirSync(storageDir);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err.code;
        }
    }

	return storageDir;
}

var sendFileListView = function (res, files) {
	res.send(view.renderFileList(files));
}

function fsReaddirPromised(dirPath) {
    var deferred = q.defer();

	fs.readdir(dirPath, function (error, files) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(files);
        }
    });

    return deferred.promise;
}

function fsStatPromised(filePath) {
    var deferred = q.defer();

    fs.stat(filePath, function (error, stats) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(stats);
        }
    });

    return deferred.promise;
}
