var http = require("http"),
	express = require("express"),
	url = require("url"),
	path = require("path"),
    app = express();

http.createServer(app).listen(3000);

app.get("/*", function (req, res) {
	var uri = url.parse(req.url).pathname;
	var filePath = path.join(process.cwd(), "storage", uri);

	path.exists(filePath, function(exists) {
		if (exists) {
			res.send("file exists " + filePath);
		} else {
			res.send("file doesn't exist " + filePath);			
		}
	})

});
