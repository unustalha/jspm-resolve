const expect = require("chai").expect;

const path = require("path");
const jspm = require("../index.js");

const opts = {
    moduleDirectory: [
        "jspm_packages",
        "node_modules"
    ],
    paths: []
};

describe("paths", function () {
    it("handles modules from jspm", function () {
        expect(jspm.resolveImport("jquery", "jquery", opts))
            .to.equal(path.resolve(__dirname, "../jspm_packages/npm/jquery@2.2.1.js"));
    });
});
