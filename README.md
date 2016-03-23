<img src="http://static.nfl.com/static/content/public/static/img/logos/nfl-engineering-light.svg" width="300" />

# jspm-resolve

[![npm package](https://img.shields.io/npm/v/jspm-resolve.svg?style=flat-square)](https://www.npmjs.org/package/jspm-resolve)
[![build status](https://img.shields.io/travis/nfl/jspm-resolve/master.svg?style=flat-square)](https://travis-ci.org/nfl/jspm-resolve)
[![dependency status](https://img.shields.io/david/nfl/jspm-resolve.svg?style=flat-square)](https://david-dm.org/nfl/jspm-resolve)

A module resolver that locates jspm packages using [resolve](https://www.npmjs.com/package/resolve).

## Installation

```sh
npm install --save-dev jspm-resolve
```

## Parameters
`jspm-resolve` takes the same parameters as [resolve](https://www.npmjs.com/package/resolve), plus these:

- `pathsOverride`: _(Object)_ Override paths set in your jspm config file.
- `rootDir`: _(String)_ Specify a custom jspm root directory (relative to your project's root).

## Asynchronous use

```js
import resolve from "jspm-resolve";

resolve("react", {}, (err, result) => {
    if (err) {
        throw err;
    }

    console.log(result) // path to jspm react
});
```

## Synchronous use

```js
import resolve from "jspm-resolve";

const result = resolve.sync("react", {});
console.log(result) // path to jspm react
```

## License

MIT
