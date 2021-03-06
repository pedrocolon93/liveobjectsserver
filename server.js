var http = require("http"),
    express = require("express"),
    StorageAccessor = require("./controller/StorageAccessor.js"),
    commandCgi = require("./controller/command-cgi.js"),
    configCgi = require("./controller/config-cgi.js"),
    uploadCgi = require("./controller/upload-cgi.js"),
    actionCgi = require("./controller/action-cgi.js"),
    configModel = require("./model/config.js");

app = express();
app.use(express.static(__dirname + '/public'));

app.get("/command.cgi", commandCgi.commandExecutionCallback);
app.get("/config.cgi", configCgi.configExecutionCallback);
app.get("/upload.cgi", uploadCgi.uploadFormCallback);
app.get("/action.cgi", actionCgi.actionExecutionCallback);
app.get("/*", StorageAccessor.fileGetCallback);

app.post("/upload.cgi", uploadCgi.uploadFileCallback);

configModel.connect(function () {
    var address = process.argv[2]; 
    var port = process.argv[3]; 

    if (port == undefined) {
        port = 80;
    }

    if (address == undefined) {
        http.createServer(app).listen(3000);
    } else {
        http.createServer(app).listen(port, address);
    }
});
