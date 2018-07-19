const expect = require('chai').expect();
const request = require("request");

describe("Fetch from database", function () {
    describe("Get particular user", function () {
        const url = 'https://windy-smoke-209201.appspot.com/';
        it("returns status 200", function (done) {
            request(url, function (err, response, body) {
                expect(response.statusCode).to.equal(200);
            });
            done();
        })
    })
});
