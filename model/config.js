var mongoose = require('mongoose');

var config = {};

config.connect = function (callback) {
	mongoose.connect('mongodb://localhost/flashair-compat-server');
	mongoose.connection.on("open", function () {
		config.Config = mongoose.model("Config", config.ConfigSchema);

		callback();
	});
}

config.ConfigSchema = mongoose.Schema({
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

module.exports = config;
