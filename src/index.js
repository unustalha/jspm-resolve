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

const resolver = (id, opts = {}, cb, sync = false) => {
    // Return cached resolve if found
    if (resolveCache[id]) {
        if (!sync && cb) {
            return cb(null, resolveCache[id]);
        }

        return resolveCache[id];
    }

    try {
        if (!root) {
            root = findRoot(opts.basedir || cwd);
            jspm.setPackagePath(root);
            loader = jspm.Loader();
        }

        let normalizedPath = loader.normalizeSync(id).replace("file://", "");

        if ((/\.(?:css|eot|gif|jpe?g|json|otf|png|swf|svg|ttf|woff)\.js$/).test(normalizedPath)) {
            normalizedPath = normalizedPath.replace(/\.js$/, "");
        }

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
            resolveCache[id] = found ? normalizedPath : found;
            return resolveCache[id];
        }

        npmResolver(normalizedPath, opts, (err, found) => {
            resolveCache[id] = found ? normalizedPath : found;

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
