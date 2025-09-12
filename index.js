const organizeImports = require("prettier-plugin-organize-imports")
const newLine = require("prettier-new-line-plugin")
const allParserKeys = Array.from(
  new Set([...Object.keys(newLine.parsers), ...Object.keys(organizeImports.parsers)])
);
/** @type {import("prettier").Parser}  */
const combinedParser = {
  ...newLine,
  ...organizeImports,
  parsers: allParserKeys.reduce((acc, key) => {
    acc[key] = {
      ...(newLine.parsers[key] || {}),
      ...(organizeImports.parsers[key] || {}),
      preprocess(code, options) {
        let preprocessed = code;
        if (organizeImports.parsers[key]?.preprocess) {
          preprocessed = organizeImports.parsers[key].preprocess(preprocessed, options);
        }
        if (newLine.parsers[key]?.preprocess) {
          preprocessed = newLine.parsers[key].preprocess(preprocessed, options);
        }
        return preprocessed;
      },
    };
    return acc;
  }, {}),
};
module.exports = combinedParser;