var mongoose = require('mongoose');

var config = {};

mongoose.connect('mongodb://localhost/flashair-compat-server');
mongoose.connection.on("open", function () {
	config.Config = mongoose.model("Config", config.ConfigSchema);
});

config.ConfigSchema = mongoose.Schema({
	"APPAUTOTIME": 	Number,
	"APPINFO": String,
	"APPMODE": Number,
	"APPNAME": String,
	"APPNETWORKKEY": String,
	"APPSSID": String,
	"BRGNETWORKKEY": String,
	"BRGSSID": String,
	"CID": String,
	"CIPATH": String,
	"DELCGI": String,
	"DNSMODE": Number;
	"IFMODE": Number,
	"LOCK": Number,
	"MASTERCODE": String,
	"NOISE_CANCEL": Number,
	"PRODUCT": String,
	"UPDIR": String,
	"UPLOAD": Number,
	"VENDOR": String,
	"VERSION": String
});

module.exports = config;