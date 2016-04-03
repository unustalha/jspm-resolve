var path = require("path");
var jspmResolve = require("jspm-resolve");

exports.interfaceVersion = 2;

exports.resolve = function resolve(source, file, config) {
    const opts = Object.assign({}, config, {
        basedir: path.dirname(file)
    });

    const resolvedPath = jspmResolve.sync(source, opts);

    if (!resolvedPath) {
        return {
            found: false
        };
    }

    return {
        found: true,
        path: resolvedPath
    };
};

