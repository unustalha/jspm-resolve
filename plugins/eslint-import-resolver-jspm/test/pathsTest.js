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
    it("returns true when a module is found", () => {
        expect(jspm.resolveImport("jquery", "jquery", opts))
            .to.eql({
                found: true,
                path: path.resolve(__dirname, "../jspm_packages/npm/jquery@2.2.1.js")
            });
    });

    it("returns false when a module is not found", () => {
        expect(jspm.resolveImport("react", "react", opts))
            .to.eql({
                found: false
            });
    });
});
