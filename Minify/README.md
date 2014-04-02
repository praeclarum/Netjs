# Minify

Minify is a JavaScript ES5 minifier.

This minifier eliminates comments, whitespace, and shortens/obfuscates symbol names (even works with `defineProperty`).

## Usage

	Minify.exe script.js

This will produce a file called `script.min.js` that is the minified code. A dictionary is also generated in a file called `script.min-names.txt`.

To prevent some symbols from being renamed, pass them as additional arguments:

	Minify.exe script.js ImportantThing OtherThing

