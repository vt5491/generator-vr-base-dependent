'use strict';
var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var generators = require('yeoman-generator').generators;

describe('vr-base-dependent:app', function () {
  before(function (done) {
    // create a mock 'vr-base-dependent:sub-angular'
    var angularServiceDummy = generators.Base.extend({
      
      initializing: function () {
        //console.log('now in initializing');
        // write a line to simulate ending of an angular service
        var fn = 'app/scripts/services/' + this.args + '.js';
        console.log('dummy: fn=' + fn);
        this.fs.write(fn, '//dummy-line\n  });\n');
      },
    });

    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ appName: 'vrtest' })
      .withGenerators([ [angularServiceDummy, 'angular:service'] ])
      .on('end', done);
  });

  // Note: these files are not physically created by the unit test.  They only
  // get created in the logical in-memory file system  
  it('creates files', function () {
    assert.file([
      'bower.json',
      'package.json',
      '.editorconfig',
      '.jshintrc'
    ]);

    // assert.file([
    //   'app/scripts/services/vrtest.js',
    // ]);
  });
});

describe('vr-base-dependent:app-methods', function () {
  before(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      };

    this.vrBaseDependent = helpers.createGenerator('vr-base-dependent', [
      '../../generators/app',
    ]);

    done();
   }.bind(this));
  }//.on('end', done)
  );

  it('_initGlobals works', function(){
    var result = this.vrBaseDependent._initGlobals();

    //console.log('result =' + result);
    console.log('this.vrBaseDependent.artifacts.services.mainService' + this.vrBaseDependent.artifacts.services.mainService);
    //assert.equal(this.vrBaseDependent.artifacts.services.mainService, this.vrBaseDependent.defaultArtifactNames.mainService + '.js');
    assert.equal(this.vrBaseDependent.artifacts.services.mainService, this.vrBaseDependent.defaultArtifactNames.mainService);
  });

});
