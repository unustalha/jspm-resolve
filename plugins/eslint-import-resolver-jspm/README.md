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

`jspm-resolve` methods and parameters are identical to [resolve](https://www.npmjs.com/package/resolve).

See [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) for a full list of options.

## License

MIT
