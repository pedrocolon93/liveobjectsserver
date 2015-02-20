var path = require("path"),
    fs = require('fs'),
    jade = require("jade");

exports.renderFileList = function (files) {
    console.log("files = " + files);

    var jadePath = path.join(__dirname, "files.jade");
    var html = jade.renderFile(jadePath, {"files": files});
    console.log("html = " + html);

    return html;
}

exports.renderUploadForm = function () {
    return fs.readFileSync("view/upload.html", {"encoding": "utf8"});
}
