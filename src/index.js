import jspm from "jspm";
import findRoot from "find-root";
import npmResolver from "resolve";

/**
 * Checks against jspm packages to resolve modules
 * @param  {String}  id       Module to resolve
 * @param  {Object}  opts     Options to passthrough to the resolver
 * @param  {Boolean} sync     Perform a synchronous resolve
 * @return {Boolean}
 */
let root, map;
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
            root = findRoot(opts.basedir || process.cwd());
            jspm.setPackagePath(root);
            map = jspm.Loader().map;
        }

        if (!map) {
            return null;
        }

        const [jspmPackage] = id.split("/");

        const target = map[jspmPackage];

        if (!target) {
            return null;
        }

        // Colons not allowed on file systems
        let targetPath = target.replace(":", "/");

        // jspm only uses .js for packages
        if (!(/\.js$/).test(targetPath)) {
            targetPath = `${targetPath}.js`;
        }

        if (sync) {
            const found = npmResolver.sync(targetPath, opts);
            resolveCache[id] = found;

            return found;
        }

        npmResolver(targetPath, opts, (err, result) => {
            resolveCache[id] = result;

            if (cb) {
                return cb(err, result);
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
