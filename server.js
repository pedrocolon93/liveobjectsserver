var http = require("http"),
	express = require("express"),
	StorageAccessor = require("./controller/storageAccessor.js")

app = express();
http.createServer(app).listen(3000);

app.get("/*", StorageAccessor.fileGetCallback);
