var path = require("path"),
	jade = require("jade");

var renderFileList = function (dir, files) {
	console.log("files = " + files);

	var jadePath = path.join(process.cwd(), "view", "files.jade");
	var html = jade.renderFile(jadePath, {"dir": dir, "files": files});
	console.log("html = " + html);

	return html;
}

view = {}
view.renderFileList = renderFileList;
module.exports = view;