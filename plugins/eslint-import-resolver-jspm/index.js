var path = require("path");
var resolve = require("jspm-resolve");

exports.resolveImport = function resolveImport(source, file, config) {
    const opts = Object.assign({}, config, {
        basedir: path.dirname(file)
    });

    return resolve.sync(source, opts);
};

