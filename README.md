![](https://github.com/tom-ripley/angular-app-automation/blob/master/resources/icon.png)

> Gulp automation suite for an angular app.

This package does certainly not cover all your needs.  
Feel free to fork it and create pull request with your improvements.  
Jump to the [**Task reference**](https://github.com/tom-ripley/angular-app-automation#task-reference).

# Features

- Compiles JavaScript modules into a single file ([browserify](http://browserify.org/)) with source maps
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

Take a look at [angular-app-seed](https://github.com/tom-ripley/angular-app-seed) to see how to use this package.

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
cssSrc|LESS & CSS source files, defaults to `./src/**/*.less{,.css}`
cssApp|LESS entry point for LESS compiler, defaults to `./src/app.less`
cssLint|CSS lint config object, defaults in `recess.default.cfg` file
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
`plato:report`|Generates plato report
`plato:serve`|Serves plato report
`coverage:report`|Generates coverage report (istanbul)
`coverage:serve`|Serves coverage report
