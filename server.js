var http = require("http"),
	express = require("express"),
    app = express();

http.createServer(app).listen(3000);

app.get("/*", function (req, res) {

	res.send("request url: " + req.url.toString());
});
