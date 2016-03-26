var path = require("path");
var resolve = require("jspm-resolve");

exports.resolveImport = function resolveImport(source, file, config) {
    const opts = Object.assign({}, config, {
        basedir: path.dirname(file)
    });

    const resolvedPath = resolve.sync(source, opts);

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

