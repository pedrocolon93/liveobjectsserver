var url = require("url"),
	path = require("path"),
	fs = require("fs"),
	os = require("os"),
	multiparty = require("multiparty"),
    mongoose = require("mongoose"),
	StorageAccessor = require("./StorageAccessor.js");
	commandResponse = require("../view/commandResponse.js");
    configModel = require("../model/config.js");
	view = require("../view/view.js");

configCgi = {};

configCgi.configExecutionCallback = function (req, res) {
	var query = req.query;
	var masterCode = query.MASTERCODE;

	console.log(query);

	if (!masterCode) {
		console.log("config commands require the query string 'MASTERCODE'");
        res.send('ERROR');
		return;
	}

    delete query.MASTERCODE;

    res.contentType('text/plain');

    configModel.Config.find({}, function (err, configs) {
        if (err) {
            console.log(err);
            res.send('ERROR');
            return;
        }

        console.log("configs.length = " + configs.length);
        var config = configs.length > 0 ? configs[0] : new configModel.Config();

        var invalidQueryExists = false;
        Object.keys(query).forEach(function (queryString) {
            var attributes = Object.keys(configModel.ConfigSchema.paths);
            if (attributes.indexOf(queryString) == -1) {
                console.log("invalid query string '" + queryString + "'");
                console.log(attributes);
                invalidQueryExists = true;
                return;
            }

            config.queryString = query[queryString];
        });

        if (invalidQueryExists) {
            res.send('ERROR');
            return;
        }

        config.save(function (err) {
            if (err) {
                console.log(err);
                res.send('ERROR');
            } else {
                res.send('SUCCESS');
            }
        });
    });
}

module.exports = configCgi;
