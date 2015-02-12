var mongoose = require('mongoose');

var config = {};

mongoose.connect('mongodb://localhost/flashair-compat-server');
mongoose.connection.on("open", function () {
	config.Config = mongoose.model("Config", config.ConfigSchema);
});

config.ConfigSchema = mongoose.Schema({
	"APPAUTOTIME": Number,
	"APPINFO": String,
	"APPMODE": Number
});


module.exports = config;