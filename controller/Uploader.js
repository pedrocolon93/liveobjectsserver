var url = require("url"),
	path = require("path"),
	fs = require("fs"),
	os = require("os"),
	multiparty = require("multiparty"),
	view = require("../view/view.js");

Uploader = {};

Uploader.uploadFormCallback = function (req, res) {
	res.send(view.renderUploadForm());
};

Uploader.uploadFileCallback = function (req, res) {
	var form = new multiparty.Form();

	form.on("file", function (name, file) {
		console.log(name);
		console.log(file);

		var tmpPath = file.path;
		var uploadPath = path.join(__dirname, "../storage", file.originalFilename);
		console.log("uploadPath = " + uploadPath);
		fs.renameSync(tmpPath, uploadPath);
	});

	form.parse(req);
};

module.exports = Uploader;