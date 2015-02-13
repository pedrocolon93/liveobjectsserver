var path = require("path"),
	fs = require('fs'),
	sprintf = require('sprintf').sprintf;

commandResponse = {}

commandResponse.createFileList = function (dir, fileStatses) {
	console.log(fileStatses);

	var fileList = "WLANSD_FILELIST\r\n";

	fileStatses.forEach(function (fileStats) {
		stats = fileStats.stats;

		fileList += sprintf("%s,%s,%d,%d,%d,%d\r\n",
			dir, fileStats.file, stats.size,
			buildAttribute(stats), buildDate(stats), buildTime(stats));
	});

	return fileList;
}

var buildAttribute = function (stats) {
	var bits = 0;

	if (stats.isDirectory()) bits = (1 << 4);

	return bits;
}

var buildDate = function (stats) {
	var ctime = stats.ctime;
	var bits = 0;

	bits |= (ctime.getFullYear() - 1980) << 9;
	bits |= (ctime.getMonth() + 1) << 5;
	bits |= ctime.getDate();

	return bits;
}

var buildTime = function (stats) {
	var ctime = stats.ctime;
	var bits = 0;

	bits |= ctime.getHours() << 11;
	bits |= ctime.getMinutes() << 5;
	bits |= Math.floor(ctime.getSeconds() / 2);

	return bits;
}

module.exports = commandResponse;
