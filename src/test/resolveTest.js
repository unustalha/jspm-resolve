import pkg from "../../package.json";
import path from "path";
const cwd = process.cwd();

import {expect} from "chai";
import pluginPkg from "../../plugins/eslint-import-resolver-jspm/package.json";
import proxyquire from "proxyquire";

import {EventEmitter} from "events";
EventEmitter.defaultMaxListeners = Infinity;

describe("jspm-resolve", () => {
    const resolveOpts = {
        moduleDirectory: [
            "jspm_packages",
            "node_modules"
        ]
    };

    const dependencies = pkg.jspm.dependencies;
    let resolve;

    describe("-> resolves jspm aliases", () => {
        // Reload module on each test
        beforeEach(() => resolve = proxyquire("../", {
            "jspm": {
                method: require("jspm"),
                "@global": true
            }
        }));

        it("-> asynchronous", (done) => {
            const alias = "alias/aliasImportTest.js";

            resolve(alias, resolveOpts, (err, result) => {
                expect(result)
                    .to.be.a.string;

                expect(result)
                    .to.have.string(alias);

                done();
            });
        });

        it("-> synchronous", () => {
            const alias = "alias/aliasImportTest.js";
            const result = resolve.sync(alias, resolveOpts);

            expect(result)
                .to.be.a.string;

            expect(result)
                .to.have.string(alias);
        });
    });

    describe("-> resolves jspm packages", () => {
        describe("-> asynchronous", () => {
            // Reload module on each test
            before(() => resolve = proxyquire("../", {
                "jspm": {
                    method: require("jspm"),
                    "@global": true
                }
            }));

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
            // Reload module on each test
            before(() => resolve = proxyquire("../", {
                "jspm": {
                    method: require("jspm"),
                    "@global": true
                }
            }));

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

    describe("-> identifies core modules", () => {
        // Reload module on each test
        before(() => resolve = proxyquire("../", {
            "jspm": {
                method: require("jspm"),
                "@global": true
            }
        }));

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

    describe("-> resolves jspm packages with a specified root directory", () => {
        const pluginDevDependencies = pluginPkg.jspm.devDependencies;

        const customResolveOpts = Object.assign({}, resolveOpts, {
            rootDir: "./plugins/eslint-import-resolver-jspm"
        });

        describe("-> asynchronous", () => {
            // Reload module on each test
            before(() => resolve = proxyquire("../", {
                "jspm": {
                    method: require("jspm"),
                    "@global": true
                }
            }));

            Object.keys(pluginDevDependencies).forEach((dependency) => {
                it(dependency, (done) => {
                    resolve(dependency, customResolveOpts, (err, result) => {
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
            // Reload module on each test
            before(() => resolve = proxyquire("../", {
                "jspm": {
                    method: require("jspm"),
                    "@global": true
                }
            }));

            Object.keys(pluginDevDependencies).forEach((dependency) => {
                it(dependency, () => {
                    const result = resolve.sync(dependency, customResolveOpts);

                    expect(result)
                        .to.be.a.string;

                    expect(result)
                        .to.have.string(dependency);
                });
            });
        });
    });

    context("-> node modules", () => {
        // Reload module on each test
        before(() => resolve = proxyquire("../", {
            "jspm": {
                method: require("jspm"),
                "@global": true
            }
        }));

        it("does not resolve npm modules", () => {
            const testModule = "find-root";
            const result = resolve.sync(testModule, resolveOpts);

            expect(result)
                .to.be.false;
        });
    });

    context("-> file extension resolution", () => {
        // Reload module on each test
        beforeEach(() => resolve = proxyquire("../", {
            "jspm": {
                method: require("jspm"),
                "@global": true
            }
        }));

        it("does not resolve jspm packages with no default file extensions", () => {
            const testModule = "./src/test/fixtures/fileExtensionTest";

            const result = resolve.sync(testModule, Object.assign({}, resolveOpts, {
                extensions: []
            }));

            expect(result)
                .to.be.false;
        });

        it("resolves jspm packages with no defined file extensions", () => {
            const testModule = "./src/test/fixtures/fileExtensionTest";

            const result = resolve.sync(testModule, Object.assign({}, resolveOpts));

            expect(result)
                .to.be.a.string;

            expect(path.relative(cwd, result))
                .to.include(path.relative(cwd, testModule));
        });

        it("resolves jspm packages with default .js file extensions", () => {
            const testModule = "./src/test/fixtures/fileExtensionTest";

            const result = resolve.sync(testModule, Object.assign({}, resolveOpts, {
                extensions: [".js"]
            }));

            expect(result)
                .to.be.a.string;

            expect(path.relative(cwd, result))
                .to.include(path.relative(cwd, testModule));
        });
    });
});
