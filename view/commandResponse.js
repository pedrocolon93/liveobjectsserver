var path = require("path"),
	fs = require('fs'),
	os = require('os');

view = {}

view.createFileList = function (dir, fileStatses) {
	console.log(fileStatses);

	var fileList = "WLANSD_FILELIST" + os.EOL;

	fileStatses.forEach(function (fileStats) {
		stats = fileStats.stats;

		fileList += dir + ", " + fileStats.file + ", " + stats.size + ", " +
			buildAttribute(stats) + ", " + buildDate + ", " + buildTime + os.EOL;
	});

	return fileList;
}

var buildAttribute = function (stats) {
	return "<dummy>";
}

var buildDate = function (stats) {
	return "<dummy>";
}

var buildTime = function (stats) {
	return "<dummy>";
}

module.exports = view;