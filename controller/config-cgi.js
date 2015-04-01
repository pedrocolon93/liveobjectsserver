var url = require("url"),
	path = require("path"),
	fs = require("fs"),
	os = require("os"),
	multiparty = require("multiparty"),
    mongoose = require("mongoose"),
	StorageAccessor = require("./StorageAccessor.js"),
	commandResponse = require("../view/commandResponse.js"),
    configModel = require("../model/config.js"),
	view = require("../view/view.js"),
    configSync = require("./config-sync.js");

exports.configExecutionCallback = function (req, res) {
	var query = req.query;
	var masterCode = query.MASTERCODE;

	console.log(query);

	if (!masterCode) {
		console.log("config commands require the query string 'MASTERCODE'");
        res.send('ERROR');
		return;
	}

    res.contentType('text/plain');

    configModel.getConfig(function (err, config) {
        if (err) {
            console.log(err);
            res.send('ERROR');
            return;
        }

        updateConfig(query, res, config);
        saveConfig(res, config);
    });
}

var updateConfig = function (query, res, config) {
    if (Object.keys(query).length == 1) {
        // only MASTERCODE as a query string
        config.MASTERCODE = query.MASTERCODE;
    } else {
        if (!checkMastercode(query, config)) {
            res.send('ERROR');
            return;
        }

        delete query.MASTERCODE;

        if (!mergeQuery(query, config)) {
            res.send('ERROR');
            return;
        }
    }
}

var checkMastercode = function (query, config) {
    if (!('MASTERCODE' in config) || config.MASTERCODE == undefined) {
        console.log("set the MASTERCODE first");
        return false;
    }

    if (config.MASTERCODE != query.MASTERCODE) {
        console.log("the given MASTERCODE doesn't correspond to the one in the database");
		console.log("expected: " + config.MASTERCODE + ", specified: " + query.MASTERCODE);
        return false;
    }

    return true;
}

var mergeQuery = function (query, config) {
    var invalidQueryExists = false;
    Object.keys(query).forEach(function (queryString) {
        var attributes = Object.keys(configModel.ConfigSchema.paths);
        if (attributes.indexOf(queryString) == -1) {
            console.log("invalid query string '" + queryString + "'");
            console.log(attributes);
            invalidQueryExists = true;
            return;
        }

        config[queryString] = query[queryString];
    });

    if (invalidQueryExists) {
        return false;
    }

    return true;
}

var saveConfig = function (res, config) {
    config.save(function (err) {
        if (err) {
            console.log(err);
            res.send('ERROR');
        } else {
            configSync.syncHostapd(config, function (err) {
                if (err) {
                    console.log(err);
                    res.send('ERROR');
                } else {
                    res.send('SUCCESS');
                }
            });
        }
    });
}
