var fs = require("fs"),
    child_process = require("child_process"); 

var actions = {
    RESTART_NETWORK : { func: restartNetwork, params: null },
};

exports.actionExecutionCallback = function (req, res) {
    var query = req.query;
    var code = query.code;

    if (!code) {
        console.log("code is not specified as a query string");
        res.sendStatus(404);
        return;
    }

    if (!(code in actions)) {
        console.log("undefined code '" + code + "'");
        res.sendStatus(404);
        return;
    }

    actions[code].func(function(err) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
}

function restartNetwork(callback) {
    child_process.exec("systemctl restart hostapd",
        function (err, stdout, stderr) {
            callback(err);
    }); 

}
