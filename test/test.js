var should = require("should"),
    path = require("path"),
    thenifyAll = require("thenify-all"),
    q = require('q'),
    storageAccessor = require('../controller/StorageAccessor.js');

var fs = thenifyAll(require('fs'), {}, [
    'mkdir',
    'rmdir',
]);

describe("StorageAccessor", function () {
    var relativePath = ".";

    before(function(done) {
        var dirPath = path.join(__dirname, relativePath, 'storage');
        fs.rmdir(dirPath)
        .then(done)
        .catch(function(error) {
            if (error.code === 'ENOENT') {
                done();
            } else {
                done(error);
            }
        });
    });

	describe("#getStoragePath()", function () {
		it("should return the path to 'storage' dir", function () {
            storageAccessor.getStoragePath(relativePath)
            .then(function (resultPath) {
                var expectedPath = path.join(__dirname, relativePath);
                return resultPath.should.equal(expectedPath);
            });
		})
	})
})

