var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/flashair-compat-server');

var config = {};

config.ConfigSchema = mongoose.Schema({
	"APPAUTOTIME": Number,
	"APPINFO": String,
	"APPMODE": Number
});

module.exports = config;