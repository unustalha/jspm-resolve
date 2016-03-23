<img src="http://static.nfl.com/static/content/public/static/img/logos/nfl-engineering-light.svg" width="300" />

# eslint-import-resolver-jspm

[![npm package](https://img.shields.io/npm/v/jspm-resolve.svg?style=flat-square)](https://www.npmjs.org/package/jspm-resolve)
[![dependency status](https://img.shields.io/david/nfl/jspm-resolve.svg?style=flat-square)](https://david-dm.org/nfl/jspm-resolve)

A jspm resolver for [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import).

## Installation

```sh
npm install --save-dev eslint-plugin-import eslint-import-resolver-jspm
```

## Usage

Pass this resolver to `eslint-plugin-import` using your `.eslintrc`:

### In YAML:
```yaml
---
settings:
  import/resolver:
    jspm: { moduleDirectory: jspm_packages }
    node: true
```

### In JSON:
```json
---
"settings": {
  "import/resolver": {
    "jspm": {
      "moduleDirectory": "jspm_packages"
    },
    "node": true
  }
}
```

`eslint-plugin-import` parameters are identical to [resolve](https://www.npmjs.com/package/resolve), plus these:

- `pathsOverride`: _(Object)_ Override paths set in your jspm config file.
- `rootDir`: _(String)_ Specify a custom jspm root directory (relative to your project's root).

#### Sample config

```js
{
    "plugins": [
        "import"
    ],
    "settings": {
        "import/ignore": [
            "jspm_packages",
            "node_modules",
            ".(scss|less|css)$",
            ".[^js(x)?]+$"
        ],
        "import/resolve": {
            "moduleDirectory": [
                "jspm_packages",
                "node_modules",
                "."
            ]
        },
        "import/resolver": {
            "jspm": {
                "moduleDirectory": "jspm_packages", // Override, don't look for jspm_packages in node_modules
                "pathsOverride": {
                    "public": "src" // maps public/foo.js -> src/foo.js
                },
                "rootDir": "./path/to/custom/jspmRootDir"
            },

            "node": true // Set to true to fall back to Node resolver
        }
    }
}
```


See [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) for a full list of options.

## License

MIT
