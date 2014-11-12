![](https://raw.githubusercontent.com/nicolas-briemant/angular-app-automation/master/resources/icon-automation.png)

[![Dependency Status](https://david-dm.org/nicolas-briemant/angular-app-automation.png)](https://david-dm.org/nicolas-briemant/angular-app-automation)

Gulp automation suite for an angular app.

This package does certainly not cover all your needs.  
Feel free to fork it and create pull request with your improvements.

# Features

- Compiles JavaScript modules into a single file ([browserify](http://browserify.org/)) with source maps
- Compiles [Jade](http://jade-lang.com/) templates as javascript module if needed
- Compiles [CoffeeScript](http://coffeescript.org/) files as javascript module if needed
- Uses [ng-annotate](https://github.com/olov/ng-annotate) before minification ([UglifyJS2](https://github.com/mishoo/UglifyJS2))
- Compiles [LESS](http://lesscss.org/) into a single CSS file with source maps
- Uses [csso](https://github.com/css/csso) to minify CSS and postprocesses it with [autoprefixer](https://github.com/postcss/autoprefixer)
- Lint JS ([jshint](http://www.jshint.com/)) and CSS ([recess](http://twitter.github.io/recess/))
- Runs unit tests using [karma](http://karma-runner.github.io/) with [jasmine](http://jasmine.github.io/)
- Generates coverage report with [istanbul](https://github.com/gotwarlost/istanbul) and complexity/maintainability reports (history) with [plato](https://github.com/es-analysis/plato)
- Provides a development server ([express](http://expressjs.com/)) with [livereload](http://livereload.com/) capability

# Installation

```shell
npm install --save-dev angular-app-automation
```

You need to have [gulp](http://gulpjs.com/):
```shell
npm install -g gulp
```

# Usage

Take a look at [angular-app-seed](https://github.com/nicolas-briemant/angular-app-seed) to see how to use this package.

```javascript
// gulpfile.js

var gulp = require('gulp')
  , automation = require('angular-app-automation');

automation(gulp, /* options here */);

// no option
automation(gulp);

// inline options
automation(gulp, {jsSrc: './src/js/**/*.js', jsApp: './src/main.js'});
```

# Configuration

Here are the available options:

option|purpose
---|---
name|name of the application, defaults to `app`
port|port used by express, defaults to `5000`
lrport|livereload port, defaults to `5001`
jsSrc|JavaScript source files, defaults to `./src/**/*.js`
jsApp|JavaScript entry point for browserify, defaults to `./src/app.js`
jsLint|JavaScript lint config object, defaults in `jshint.default.cfg` file
jsUseLint|enable/disable jshint, default `true`
jsJade|Indicates if browserify should use a [Jade transformation](https://github.com/domenic/jadeify), default `false`
jsCoffee|Indicates if browserify should use a [Coffee transformation](https://github.com/substack/coffeeify), default `false`
cssSrc|LESS & CSS source files, defaults to `./src/**/*.less{,.css}`
cssApp|LESS entry point for LESS compiler, defaults to `./src/app.less`
cssLint|CSS lint config object, defaults in `recess.default.cfg` file
cssUseLint|enable/disable recess, default `true`
htmlSrc|HTML source files, default to `./src/**/*.html`
testSrc|JavaScript unit test source files, defaults to `./src/**/*.unit.js`
testApp|JavaScript unit test entry point for browserify, defaults to `./src/app.unit.js`
buildDir|Directory of development builds, defaults to `./build`
distDir|Directory of distribution builds, defaults to `./dist`
karma|Karma config object, defaults in `karma.default.cfg`

# Convention

The default configuration is motivated by a modular organization of the application:
- src
  - app.js
  - app.less
  - index.html
  - module1
    - controller1.js
    - controller2.js
    - service1.js
    - view1.html
    - view2.html
    - style1.less
  - module2
    - ...

Take a look at this [article](https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub) for more details.

# Task reference

tasks|purpose
---|---
`dev`|Builds application (browserify, less, lint) and serve it (express, livereload)
`dev:unit`|Starts the dev environment with unit testing support (karma and jasmine)
`dist:build`|Builds distribution (minification)
`dist:serve`|Builds distribution and serve it for checking purpose
`complexity:report`|Generates complexity/maintenability report (plato)
`complexity:serve`|Serves plato report
`coverage:report`|Generates coverage report (istanbul)
`coverage:serve`|Serves coverage report
`ci`|Continuous integration task used for travis & coveralls

# Todo

- Add images optimization

# License

The MIT License (MIT)

Copyright (c) 2014 Nicolas Briemant

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
