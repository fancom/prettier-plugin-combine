# prettier-plugin-combine

A Prettier plugin that allows you to combine multiple Prettier plugins and control which ones are enabled via configuration.

## Features

- Combine multiple Prettier plugins in a single pass.
- Enable or disable plugins via Prettier config.
- Easily extendable to support more plugins.

## Installation

```sh
npm install --save-dev prettier-plugin-combine prettier-plugin-organize-imports prettier-new-line-plugin
```

## Usage

Add `prettier-plugin-combine` to your Prettier plugins in your `.prettierrc` or `prettier.config.js`:

```json
{
  "plugins": ["prettier-plugin-combine"],
  "parsersEnabled": [
    "prettier-plugin-organize-imports",
    "prettier-new-line-plugin"
  ]
}
```

- By default, all available plugins are enabled.
- To enable only specific plugins, set the `parsersEnabled` option as shown above.

## How to Add a New Plugin

1. **Install the new Prettier plugin as a dependency:**

   ```sh
   npm install --save-dev <your-prettier-plugin>
   ```

2. **Edit `index.js`:**

   Add the plugin's package name to the `AVAILABLE_PARSERS` array:

   ```javascript
   const AVAILABLE_PARSERS = [
     "prettier-plugin-organize-imports",
     "prettier-new-line-plugin",
     "your-prettier-plugin" // <-- Add your plugin here
   ];
   ```

3. **(Optional) Enable the plugin in your Prettier config:**

   ```json
   {
     "parsersEnabled": [
       "prettier-plugin-organize-imports",
       "your-prettier-plugin"
     ]
   }
   ```

4. **Done!**  
   The new plugin will be dynamically required and applied in the order specified.

## License
MIT