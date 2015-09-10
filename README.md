<img src="http://static.nfl.com/static/content/public/static/img/logos/nfl-engineering-light.svg" width="300" />
jspm-resolve
---

A module resolver that locates jspm packages using [resolve](https://www.npmjs.com/package/resolve).

## Installation

```sh
npm install --save-dev jspm-resolve
```

## Methods
jspm-resolve methods and parameters are identical to [resolve](https://www.npmjs.com/package/resolve)

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
