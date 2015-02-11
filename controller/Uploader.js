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

Uploader = {};

Uploader.uploadFormCallback = function (req, res) {
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
					uploadQuery[param].postSetting(configValue, res);
				}
			}
		});
	} else {
		res.send(view.renderUploadForm());
	}
};

Uploader.uploadFileCallback = function (req, res) {
	var form = new multiparty.Form({uploadDir: path.join(__dirname, "../tmp")});

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
};

function createUpdir (dir, res) {
	console.log("createUpdir() called");

	var absoluteDir = path.join(storagePath, dir);
	var absoluteParent = path.join(storagePath, path.join(dir, "../"));
	fs.exists(absoluteParent, function (exists) {
		if (!exists) {
			console.log("parent doesn't exist " + absoluteParent);
			res.send("fail");
			return;
		}

		fs.exists(absoluteDir, function (exists) {
			if (exists) {
				console.log("dir exists");
				return;
			}

			console.log("creaing dir " + absoluteDir);
			fs.mkdir(absoluteDir, function (err) {
				if (err) {
					console.log(err);
				}
			});
		});
	});
}

function deleteFile (filePath, res) {
	console.log(storagePath);
	console.log(filePath);
	var absolutePath = path.join(storagePath, filePath);

	fs.unlink(absolutePath, function (err) {
		if (err) {
			console.log(err);
		}
	});
}

module.exports = Uploader;