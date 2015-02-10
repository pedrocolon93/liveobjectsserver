var url = require("url"),
	path = require("path"),
	fs = require("fs"),
    app = express();

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
			res.sendFile(filePath, null, function (err) {
				if (err) {
					console.log(err);
					res.status(err.status).end();
				} else {
					console.log("Sent:", filePath);
				}
			});
		} else if (stats.isDirectory()) {
			res.send("the file is a directory " + filePath);
		} else {
			res.send("unknown file type " + filePath);
		}
	});
};

module.exports = fileGetCallback;