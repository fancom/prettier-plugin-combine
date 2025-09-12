const AVAILABLE_PARSERS = [
  "prettier-plugin-organize-imports",
  "prettier-new-line-plugin"
];

const DEFAULT_ENABLED = [...AVAILABLE_PARSERS];

/**
 * Helper to check if a parser is enabled in options.
 */
function isEnabled(options, parser) {
  const enabled = options?.combineParsersEnabled || DEFAULT_ENABLED;
  return enabled.includes(parser);
}

/**
 * Dynamically require and collect enabled parser plugins.
 */
function getEnabledParsers(options) {
  return AVAILABLE_PARSERS
    .filter(p => isEnabled(options, p))
    .map(p => ({
      key: p,
      module: require(p),
    }));
}

function getParsers(options) {
  const enabledParsers = getEnabledParsers(options);

  // Collect all parser keys from enabled plugins
  const allParserKeys = Array.from(
    new Set(
      enabledParsers.flatMap(p => Object.keys(p.module.parsers))
    )
  );

  // Build combined parsers
  return allParserKeys.reduce((acc, key) => {
    acc[key] = {
      // Merge all parser properties from enabled plugins
      ...enabledParsers.reduce(
        (merged, p) => ({ ...merged, ...(p.module.parsers[key] || {}) }),
        {}
      ),
      preprocess(code, options) {
        // Apply preprocess from each enabled plugin in order
        return enabledParsers.reduce((result, p) => {
          const parser = p.module.parsers[key];
          if (parser?.preprocess) {
            return parser.preprocess(result, options);
          }
          return result;
        }, code);
      },
    };
    return acc;
  }, {});
}

/** @type {import("prettier").Plugin} */
const plugin = {
  options: [
    {
      name: "parsersEnabled",
      type: "path",
      category: "Combine",
      array: true,
      default: DEFAULT_ENABLED,
      description: "List of enabled plugins for the combine plugin.",
    },
  ],
  get parsers() {
    return getParsers(this._options || {});
  },
  overrideOptions(options) {
    this._options = options;
  },
};

module.exports = plugin;