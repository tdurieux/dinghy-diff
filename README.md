# @tdurieux/dinghy-diff

The Dinghy Diff library facilitates tree comparison between two Abstract Syntax Tree (AST) elements. It offers support for various operations such as add, remove, update, and move. This library builds upon the groundwork laid by @Toemmsche.

For detailed documentation, please visit [https://durieux.me/dinghy-diff](https://durieux.me/dinghy-diff).

## Installation

```bash
npm install @tdurieux/dinghy-diff
```

## Usage

```javascript
const fs = require("fs");
const dinghyDiff = require("@tdurieux/dinghy-diff");

// Calculate the difference between two source files
const oldPath = "path/to/original/document";
const newPath = "path/to/changed/document";

const tNodeSerDes = new dinghyDiff.ASTDataSerDes(diffOptions);
const oldTree = tNodeSerDes.parseFromString(fs.readFileSync(oldPath).toString());
const newTree = tNodeSerDes.parseFromString(fs.readFileSync(newPath).toString());
const editScript: dinghyDiff.EditScript<dinghyDiff.ASTData> = new dinghyDiff.SemanticDiff<dinghyDiff.ASTData>(diffOptions).diff(
  oldTree,
  newTree
);
console.log(editScript);
```

## Command Line Interface

```bash
main.js diff <old> <new>

Calculate the difference between two source files. The supported languages are Dockerfile and Shell.

Positionals:
  old  Path to the original document                         [string] [required]
  new  Path to the changed document                          [string] [required]

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -f, --format   Select the output format
           [string] [choices: "editScript", "deltaTree"] [default: "editScript"]
```

## License 

Dinghy-diff is licensed under the Apache License. See the LICENSE file for details.