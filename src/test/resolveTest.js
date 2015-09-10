import {expect} from "chai";
import resolve from "../";
import pkg from "../../package.json";

describe("jspm-resolve", () => {
    const resolveOpts = {
        moduleDirectory: [
            "jspm_packages",
            "node_modules"
        ]
    };

    const dependencies = pkg.jspm.dependencies;

    describe("-> should resolve jspm packages", () => {
        describe("-> asynchronous", () => {
            Object.keys(dependencies).forEach((dependency) => {
                it(dependency, (done) => {
                    resolve(dependency, resolveOpts, (err, result) => {
                        expect(result)
                            .to.be.a.string;

                        expect(result)
                            .to.have.string(dependency);

                        done();
                    });
                });
            });
        });

        describe("-> synchronous", () => {
            Object.keys(dependencies).forEach((dependency) => {
                it(dependency, () => {
                    const result = resolve.sync(dependency, resolveOpts);

                    expect(result)
                        .to.be.a.string;

                    expect(result)
                        .to.have.string(dependency);
                });
            });
        });
    });

    describe("-> should identify core modules", () => {
        const testModules = [
            "child_process",
            "cluster",
            "fs",
            "http",
            "https",
            "os"
        ];

        for (const testModule of testModules) {
            it(testModule, () => {
                const result = resolve.isCore(testModule);

                expect(result)
                    .to.be.true;
            });
        }
    });

    it("should not find an npm module", () => {
        const testModule = "find-root";

        const result = resolve.sync(testModule, resolveOpts);

        expect(result)
            .to.equal(null);
    });
});
