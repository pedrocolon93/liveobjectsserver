var http = require("http"),
    server;

server = http.createServe(function (req, res) {
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.end("My Hello World!");
});

server.listen(3000);

console.log("Server listening on port 3000");
