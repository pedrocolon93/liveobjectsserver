var url = require("url"),
	path = require("path"),
	os = require("os"),
	view = require("../view/view.js")
    q = require("q"),
    thenifyAll = require("thenify-all");

exports.fileGetCallback = function (req, res) {
    exports.getStoragePath()
    .then(function (storagePath) {
	    var uri = url.parse(req.url).pathname;
    	var filePath = path.join(storagePath, uri);
        return filePath;
    })
    .then(fs.stat)
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

	fs.readdir(dirPath)
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
    var promises = [];
    filePaths.forEach(function (filePath) {
        promises.push(fs.stat(filePath));
    });

    q.all(promises)
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
    var deferred = q.defer();

    var storageDir = path.join(__dirname, '..', 'storage');

    fs.mkdir(storageDir)
    .then(function () {
        deferred.resolve(storageDir);
    })
    .fail(function (error) {
        if (error.code !== 'EEXIST') {
            deferred.reject(error.code);
        }
    });

	return deferred.promise;
}

var sendFileListView = function (res, files) {
	res.send(view.renderFileList(files));
}

var fs = thenifyAll(require('fs'), {}, [
    'readdir',
    'stat',
    'mkdir',
]);
