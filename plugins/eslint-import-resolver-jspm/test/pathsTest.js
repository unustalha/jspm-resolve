const expect = require("chai").expect;

const path = require("path");
const resolverPlugin = require("../index.js");

const opts = {
    moduleDirectory: [
        "jspm_packages",
        "node_modules"
    ],
    paths: []
};

describe("paths", function () {
    it("specifies the correct interface version", () => {
        expect(resolverPlugin)
            .to.have.property("interfaceVersion")
            .that.is.a("number")
            .that.equals(2);
    });

    it("returns true when a module is found", () => {
        expect(resolverPlugin.resolve("jquery", "jquery", opts))
            .to.eql({
                found: true,
                path: path.resolve(__dirname, "../jspm_packages/npm/jquery@2.2.1.js")
            });
    });

    it("returns false when a module is not found", () => {
        expect(resolverPlugin.resolve("react", "react", opts))
            .to.eql({
                found: false
            });
    });
});
