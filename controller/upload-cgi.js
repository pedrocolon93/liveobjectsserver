var url = require("url"),
	path = require("path"),
	fs = require("fs"),
	os = require("os"),
	multiparty = require("multiparty"),
	view = require("../view/view.js");

var uploadQuery = {
		UPDIR: {type: 'string', value: "/", postSetting: createUpdir},
		FTIME: {type: 'number', value: 0, postSetting: null},
		WRITEPROTECT: {type: 'boolean', value: false, postSetting: null},
		DEL: {type: 'string', value: null, postSetting: deleteFile}
	};

var storagePath = path.join(__dirname, "../storage");

exports.uploadFormCallback = function (req, res) {
	console.log("query = " + JSON.stringify(req.query));

	if (Object.keys(req.query).length > 0) {
		var configValue;

		Object.keys(uploadQuery).forEach(function (param) {
			if (param in req.query) {
				var queryValue = req.query[param];

				switch (uploadQuery[param].type) {
					case 'string':
						configValue = queryValue;
						break;
					case 'number':
						configValue = parseInt(queryValue);
						break;
					case 'boolean':
						configValue = (queryValue == "ON");
						break;
					default:
						// should never occur
				}

				uploadQuery[param].value = configValue;

				console.log(uploadQuery[param]);
				if (uploadQuery[param].postSetting) {
					uploadQuery[param].postSetting(configValue, function (err) {
						if (err) {
							console.log(err);
							res.send("failure");
						} else {
							res.send("success");
						}
					});
				}
			}
		});
	} else {
		res.send(view.renderUploadForm());
	}
};

exports.uploadFileCallback = function (req, res) {
	var tmpDir = path.join(__dirname, "../tmp");
	fs.mkdir(tmpDir, function (err) {
		if (err && err.code != 'EEXIST') {
			console.log('failed to make tmp dir');
			throw err;
		}

		var form = new multiparty.Form({uploadDir: tmpDir});

		form.on("file", function (name, file) {
			console.log(name);
			console.log(file);

			var tmpPath = file.path;
			var uploadPath = path.join(
				storagePath, uploadQuery.UPDIR.value, file.originalFilename);
			console.log("uploadPath := " + uploadPath);
			fs.renameSync(tmpPath, uploadPath);
	
			res.send("success");
		});
	
		form.parse(req);
	});
};

function createUpdir (dir, callback) {
	console.log("createUpdir() called");

	var absoluteDir = path.join(storagePath, dir);

	fs.mkdir(absoluteDir, function (err) {
		callback(err);
	});
}

function deleteFile (filePath, callback) {
	console.log(storagePath);
	console.log(filePath);
	var absolutePath = path.join(storagePath, filePath);

	fs.stat(absolutePath, function (err, stats) {
		if (err) {
			callback(err);
			return;
		}

		var deleteFunction;
		if (stats.isFile()) {
			deleteFunction = fs.unlink;
		} else if (stats.isDirectory()) {
			deleteFunction = fs.rmdir;
		} else {
			console.log("invalid file type " + JSON.stringify(stats));
			return;
		}

		deleteFunction(absolutePath, function (err) {
			callback(err);
		});
	});
}
