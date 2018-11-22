/* eslint-disable multiline-ternary */
import loaderUtils from 'loader-utils';
import validateOptions from 'schema-utils';

import schema from './options.json';

export default function loader(content) {
  if (!this.emitFile)
    throw new Error(
      'File Move Loader\n\nemitFile is required from module system'
    );

  const options = loaderUtils.getOptions(this) || {};

  validateOptions(schema, options, 'File Move Loader');

  const context =
    options.context ||
    this.rootContext ||
    (this.options && this.options.context);

  const name = loaderUtils.interpolateName(this, options.name, {
    context,
    content,
    regExp: options.regExp,
  });

  const outputPath = `${options.prefix || 'moved-staticfile---'}${name}`;

  this.emitFile(outputPath, content);

  return `module.exports = require(${JSON.stringify(`./${outputPath}`)});`;
}

export const raw = true;
