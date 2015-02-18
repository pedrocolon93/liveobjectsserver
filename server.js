var http = require("http"),
	express = require("express"),
	StorageAccessor = require("./controller/StorageAccessor.js"),
	commandCgi = require("./controller/command-cgi.js"),
	configCgi = require("./controller/config-cgi.js"),
	uploadCgi = require("./controller/upload-cgi.js"),
	configModel = require("./model/config.js");

app = express();
app.use(express.static(__dirname + '/public'));

http.createServer(app).listen(3000);

configModel.connect(function () {
	app.get("/command.cgi", commandCgi.commandExecutionCallback);
	app.get("/config.cgi", configCgi.configExecutionCallback);
	app.get("/upload.cgi", uploadCgi.uploadFormCallback);
	app.get("/*", StorageAccessor.fileGetCallback);

	app.post("/upload.cgi", uploadCgi.uploadFileCallback);
});
