# file-move-loader

move static file to output directory and keep require expression

## Requirements

This module requires a minimum of Node v6.9.0 and works with Webpack v3 and Webpack v4.

## Getting Started

To begin, you'll need to install `file-move-loader`:

```console
$ npm install file-move-loader --save-dev
```

Import (or `require`) the target file(s) in one of the bundle's files:

```js
// bundle file
import img from './file.png';
```

Then add the loader to your `webpack` config. For example:

```js
// webpack.config.js
module.exports = {
  externals: [/moved-staticfile---/],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-move-loader',
            options: {
              prefix: 'moved-staticfile---',
            },
          },
        ],
      },
    ],
  },
};
```

And run `webpack` via your preferred method. This will emit `file.png` as a file
in the output directory (with the specified naming convention, if options are
specified to do so) and transform require expression to `require('./${prefix}${filename}")`.

_Note: By default the filename of the resulting file is the MD5 hash of the
file's contents with the original extension of the required resource._

## Options

### `prefix`

Type: `String`
Default: `moved-staticfile---`

Add to each `import` filename, and with webpack `externals` to ignore parse transformed require exporession.

```js
// webpack.config.js
{
  loader: 'file-move-loader',
  options: {
    prefix: 'custom'
  }
}
```

### `context`

Type: `String`
Default: [`context`](https://webpack.js.org/configuration/entry-context/#context)

Specifies a custom file context.

```js
// webpack.config.js
...
{
  loader: 'file-move-loader',
  options: {
    name: '[path][name].[ext]',
    context: ''
  }
}
...
```

### `name`

Type: `String|Function`
Default: `'[hash].[ext]'`

Specifies a custom filename template for the target file(s) using the query
parameter `name`. For example, to copy a file from your `context` directory into
the output directory retaining the full directory structure, you might use:

```js
// webpack.config.js
{
  loader: 'file-move-loader',
  options: {
    name: '[path][name].[ext]'
  }
}
```

Or using a `Function`:

```js
// webpack.config.js
...
{
  loader: 'file-move-loader',
  options: {
    name (file) {
      if (env === 'development') {
        return '[path][name].[ext]'
      }

      return '[hash].[ext]'
    }
  }
}
...
```

_Note: By default the path and name you specify will output the file in that
same directory, and will also use the same URI path to access the file._

### `regExp`

Type: `RegExp`
Default: `undefined`

Specifies a Regular Expression to one or many parts of the target file path.
The capture groups can be reused in the `name` property using `[N]`
[placeholder](https://github.com/webpack-contrib/file-move-loader#placeholders).

```js
import img from './customer01/file.png';
```

**webpack.config.js**

```js
{
  loader: 'file-move-loader',
  options: {
    regExp: /\/([a-z0-9]+)\/[a-z0-9]+\.png$/,
    name: '[1]-[name].[ext]'
  }
}
```

_Note: If `[0]` is used, it will be replaced by the entire tested string,
whereas `[1]` will contain the first capturing parenthesis of your regex and so
on..._

## Placeholders

### `[ext]`

Type: `String`
Default: `file.extname`

The file extension of the target file/resource.

### `[hash]`

Type: `String`
Default: `'md5'`

Specifies the hash method to use for hashing the file content. See
[Hashes](https://github.com/webpack-contrib/file-move-loader#hashes).

### `[N]`

Type: `String`
Default: `undefined`

The n-th match obtained from matching the current file name against the regExp

### `[name]`

Type: `String`
Default: `file.basename`

The basename of the file/resource.

### `[path]`

Type: `String`
Default: `file.dirname`

The path of the resource relative to the webpack/config context.

## Hashes

Custom hashes can be used by specifying a hash with the following format:
`[<hashType>:hash:<digestType>:<length>]`.

### `digestType`

Type: `String`
Default: `'hex'`

The [digest](https://en.wikipedia.org/wiki/Cryptographic_hash_function) that the
hash function should use. Valid values include: base26, base32, base36,
base49, base52, base58, base62, base64, and hex.

### `hashType`

Type: `String`
Default: `'md5'`

The type of hash that the has function should use. Valid values include: md5,
sha1, sha256, and sha512.

### `length`

Type: `Number`
Default: `9999`

Users may also specify a length for the computed hash.

## License

[MIT](./LICENSE)
