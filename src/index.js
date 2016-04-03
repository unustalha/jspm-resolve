"use strict";

import jspm from "jspm";
import path from "path";
import findRoot from "find-root";
import npmResolver from "resolve";

/**
 * Checks against jspm packages to resolve modules
 * @param  {String}  id       Module to resolve
 * @param  {Object}  opts     Options to passthrough to the resolver
 * @param  {Boolean} sync     Perform a synchronous resolve
 * @return {Boolean}
 */
let root, loader;
const cwd = process.cwd();
const resolveCache = {};

const JS_EXTENSION = ".js";

const checkFileExtensions = (extensions) => {
    if (typeof extensions === "undefined") {
        return true;
    }

    return extensions.indexOf(JS_EXTENSION) !== -1;
};

const checkJspmPackage = (filePath, modules) => {
    if (typeof modules === "string") {
        return filePath.startsWith(path.join(root, modules));
    }

    return modules.some(dir => {
        return filePath.startsWith(path.join(root, dir));
    });
};

const normalizeFileExtension = (filePath, defaultJSExtensions, {moduleDirectory}) => {
    if (defaultJSExtensions) {
        if ((/\.(?:css|eot|gif|jpe?g|json|otf|png|swf|svg|ttf|woff)\.js$/).test(filePath)) {
            return filePath.replace(/\.js$/, "");
        }

        return filePath;
    }

    const isJspmPackage = checkJspmPackage(filePath, moduleDirectory);

    if (!isJspmPackage || filePath.endsWith(JS_EXTENSION)) {
        return filePath;
    }

    return `${filePath}${JS_EXTENSION}`;
};

const resolver = (id, opts = {}, cb, sync = false) => {
    // Return cached resolve if found
    if (resolveCache[id]) {
        if (!sync && cb) {
            return cb(null, resolveCache[id]);
        }

        return resolveCache[id];
    }

    try {
        const defaultJSExtensions = checkFileExtensions(opts.extensions);

        if (!root) {
            root = opts.rootDir || findRoot(opts.basedir || cwd);
            jspm.setPackagePath(root);
            loader = jspm.Loader();

            loader.config({
                defaultJSExtensions
            });
        }

        let normalizedPath = normalizeFileExtension(
            loader.normalizeSync(id).replace("file://", ""),
            defaultJSExtensions,
            opts
        );

        if (opts.pathsOverride) {
            Object.keys(opts.pathsOverride).forEach(key => {
                normalizedPath = normalizedPath.replace(
                    path.join(root, key),
                    path.join(root, opts.pathsOverride[key])
                );
            });
        }

        if (sync) {
            const found = npmResolver.sync(normalizedPath, opts);
            resolveCache[id] = found ? normalizedPath : false;
            return resolveCache[id];
        }

        npmResolver(normalizedPath, opts, (err, found) => {
            resolveCache[id] = found ? normalizedPath : false;

            if (cb) {
                return cb(err, resolveCache[id]);
            }
        });
    } catch (e) {
        resolveCache[id] = false;
        return resolveCache[id];
    }
};

/**
 * Resolver entry point
 * @param  {arguments}
 * @return {Boolean}
 */
const resolve = (...args) => resolver(...args);

/**
 * Checks if the module is a core module
 * @return {Boolean}
 */
resolve.isCore = (pkg) => {
    return npmResolver.isCore(pkg);
};

/**
 * Perform a synchronous resolve
 * @return {Boolean}
 */
resolve.sync = (id, opts) => resolver(id, opts, null, true);

export default resolve;
