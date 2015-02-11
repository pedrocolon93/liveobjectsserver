var http = require("http"),
	express = require("express"),
	StorageAccessor = require("./controller/storageAccessor.js"),
	command = require("./controller/command.js");
	Uploader = require("./controller/Uploader.js");

app = express();
app.use(express.static(__dirname + '/public'));

http.createServer(app).listen(3000);

app.get("/command.cgi", command.commandExecutionCallback);
app.get("/upload.cgi", Uploader.uploadFormCallback);
app.get("/*", StorageAccessor.fileGetCallback);

app.post("/upload.cgi", Uploader.uploadFileCallback);