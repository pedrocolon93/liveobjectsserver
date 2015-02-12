var path = require("path"),
	fs = require('fs'),
	os = require('os'),
	sprintf = require('sprintf').sprintf;

view = {}

view.createFileList = function (dir, fileStatses) {
	console.log(fileStatses);

	var fileList = "WLANSD_FILELIST\r\n";

	fileStatses.forEach(function (fileStats) {
		stats = fileStats.stats;

		fileList += sprintf("%s, %s, %d, %d, %d, %d",
			dir, fileStats.file, stats.size,
			buildAttribute(stats), buildDate(stats), buildTime(stats)) + os.EOL;
	});

	return fileList;
}

var buildAttribute = function (stats) {
	return 0;
}

var buildDate = function (stats) {
	return 0;
}

var buildTime = function (stats) {
	return 0;
}

module.exports = view;