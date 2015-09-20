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
const resolver = (id, opts = {}, cb, sync = false) => {
    try {
        const root = findRoot(process.cwd());

        jspm.setPackagePath(root);
        const {map} = jspm.Loader({});

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
            return npmResolver.sync(targetPath, opts);
        }

        return npmResolver(targetPath, opts, cb);
    } catch (e) {
        return false;
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
