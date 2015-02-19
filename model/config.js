var mongoose = require('mongoose');

exports.connect = function (callback) {
	mongoose.connect('mongodb://localhost/flashair-compat-server');
	mongoose.connection.on("open", function () {
		exports.Config = mongoose.model("Config", exports.ConfigSchema);

		callback();
	});
}

exports.getConfig = function (callback) {
    exports.Config.find({}, function (err, configs) {
        if (err) {
            callback(err);
            return;
        }

        var config = configs.length > 0 ? configs[0] : new exports.Config();
        callback(null, config);
    });         
}

exports.ConfigSchema = mongoose.Schema({
	APPAUTOTIME: 	Number,
	APPINFO: String,
	APPMODE: { type: Number, default: 4 },
	APPNAME: { type: String, default: 'myflashair-compat' },
	APPNETWORKKEY: { type: String, default: '12345678' },
	APPSSID: { type: String, default: 'flashair-compat' },
	BRGNETWORKKEY: String,
	BRGSSID: String,
	CID: String,
	CIPATH: String,
	DELCGI: String,
	DNSMODE: Number,
	IFMODE: Number,
	LOCK: Number,
	MASTERCODE: String,
	NOISE_CANCEL: Number,
	PRODUCT: String,
	UPDIR: String,
	UPLOAD: Number,
	VENDOR: { type: String, default: 'MIT Media Lab' },
	VERSION: String
});
