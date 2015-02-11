var url = require("url"),
	path = require("path"),
	fs = require("fs"),
	os = require("os"),
	multiparty = require("multiparty"),
	view = require("../view/view.js");

var uploadConfig = {
		UPDIR: {type: 'string', value: "/", postSetting: createUpdir},
		FTIME: {type: 'number', value: 0, postSetting: null},
		WRITEPROTECT: {type: 'boolean', value: false, postSetting: null},
	};

Uploader = {};

Uploader.uploadFormCallback = function (req, res) {
	console.log("query = " + JSON.stringify(req.query));

	if (Object.keys(req.query).length > 0) {
		var configValue;

		Object.keys(uploadConfig).forEach(function (param) {
			if (param in req.query) {
				var queryValue = req.query[param];

				switch (uploadConfig[param].type) {
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

				uploadConfig[param].value = configValue;

				console.log(uploadConfig[param]);
				if (uploadConfig[param].postSetting) {
					uploadConfig[param].postSetting(configValue);
				}
			}
		});

		console.log(uploadConfig);
		res.send("success");
	} else {
		res.send(view.renderUploadForm());
	}
};

function createUpdir (dir) {
	console.log("createUpdir() called");

	var absoluteDir = path.join(__dirname, "../storage", dir);
	var absoluteParent = path.join(__dirname, "../storage", path.join(dir, "../"));
	fs.exists(absoluteParent, function (exists) {
		if (!exists) {
			console.log("parent doesn't exist " + absoluteParent);
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

Uploader.uploadFileCallback = function (req, res) {
	var form = new multiparty.Form({uploadDir: path.join(__dirname, "../tmp")});

	form.on("file", function (name, file) {
		console.log(name);
		console.log(file);

		var tmpPath = file.path;
		var uploadPath = path.join(__dirname, "../storage", file.originalFilename);
		console.log("uploadPath := " + uploadPath);
		fs.renameSync(tmpPath, uploadPath);
	});

	form.parse(req);
};

module.exports = Uploader;