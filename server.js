var http = require("http"),
	express = require("express"),
	url = require("url"),
	path = require("path"),
	fs = require("fs"),
    app = express();

http.createServer(app).listen(3000);

var fileGetCallback = new function (req, res) {
	var uri = url.parse(req.url).pathname;
	var filePath = path.join(process.cwd(), "storage", uri);

	fs.exists(filePath, function(exists) {
		if (exists) {
			fs.stat(filePath, function (err, stats) {
				if (err) {
					console.log(err);
				}

				if (stats.isFile()) {
					res.send("the file is a file " + filePath);
					res.sendFile(fileName, options, function (err) {
						if (err) {
							console.log(err);
							res.status(err.status).end();
						} else {
							console.log("Sent:", filePath);
						}
					})
				} else if (stats.isDirectory()) {
					res.send("the file is a directory " + filePath);
				} else {
					res.send("unknown file type " + filePath);
				}
			});
		} else {
			res.send("file doesn't exist " + filePath);			
		}
		})	
}

app.get("/*", fileGetCallback);
}
