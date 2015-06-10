duo-typescript
============================
[![build status](https://secure.travis-ci.org/frankwallis/duo-typescript.png?branch=master)](http://travis-ci.org/frankwallis/duo-typescript)

typescript compiler plugin for duo

# Overview #

duo-typescript uses version 1.4 of the typescript compiler

# Install #

### 1. Install duo
```shell
npm install --global duo
```
### 2. Install duo in the project dependency
```shell
npm install duo
```
### 3. Install duo-typescript
```shell
npm install duo-typescript
```

# Usage #

### Command-line-interface
```shell
duo --use duo-typescript entry.ts
```

### API
Below is a ```duofile.js```, a minimal javascript file using duo API. The script specifies duo-typescript as a compiler to compile typescript to javascript. The script can be run using ```node --harmony duofile.js``
```javascript
var Duo = require('duo');
var fs = require('fs')
var path = require('path')
var typescript = require('duo-typescript');

var out = path.join(__dirname, "app.js")

Duo(__dirname)
  .entry('app.ts')
  .use(typescript({ target: 'es6' }))  // arguments is a json object containing TS compiler options
  .run(function (err, results) {
    if (err) throw err;
    fs.writeFileSync(out, results.code);  // Output javascript file
    var len = Buffer.byteLength(results.code);
    console.log('all done, wrote %dkb', len / 1024 | 0);
  });
```
Another example using duo API to output both javascript and sourcemap file. The script can be run similarly to above example.

```javascript
var Duo = require('duo');
var fs = require('fs')
var path = require('path')
var typescript = require('duo-typescript');

var out = path.join(__dirname, "app.js")
var sourcemap = path.join(__dirname, "app.ts.map")  // the file extension has to be .ts.map

Duo(__dirname)
  .entry('app.ts')
  .use(typescript({ target: 'es6' }))  // arguments is a json object containing TS compiler options
  .run(function (err, results) {
    if (err) throw err;
    fs.writeFileSync(out, results.code);  // Output javascript file
    fs.writeFileSync(outsourcemap, results.map);  // Output sourcemap file
    var len = Buffer.byteLength(results.code);
    console.log('all done, wrote %dkb', len / 1024 | 0);
  });
```

# Options #

duoTypescript(options);

options can be any of the usual TypeScript compiler options, plus:

Name       		   | Description											| Default
-------------------|--------------------------------------------------------|-----------
gulpMode           | use gulp-style logging									| false

