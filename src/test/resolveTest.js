import {expect} from "chai";
import resolve from "../";
import pkg from "../../package.json";
import pluginPkg from "../../plugins/eslint-import-resolver-jspm/package.json";

describe("jspm-resolve", () => {
    const resolveOpts = {
        moduleDirectory: [
            "jspm_packages",
            "node_modules"
        ]
    };

    const dependencies = pkg.jspm.dependencies;

    describe("-> resolves jspm aliases", () => {
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

    describe("-> identifies core modules", () => {
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

    it("does not find npm modules", () => {
        const testModule = "find-root";

        const result = resolve.sync(testModule, resolveOpts);

        expect(result)
            .to.be.false;
    });
});
