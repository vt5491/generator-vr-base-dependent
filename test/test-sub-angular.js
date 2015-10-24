//
// test-sub-angular.js
//
// unit test for the subgenerator 'sub-angular'
//
// created 2015-10-22
//

'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var generators = require('yeoman-generator').generators;
//var runContext = require('yeoman-generator').test.RunContext;
var mocha_sinon = require('mocha-sinon');
//var fs = require('mem-fs-editor');
var fs = require('fs');

// I'm just leaving this in for all the experiments
/*
describe('vr-base-dependent:sub-angular', function () {
  
  before(function (done) {
    this.spy = this.sinon.spy();
    var angularServiceDummy = generators.Base.extend({
      // exec: function () {
      //   var done = this.async();
        
      //   this.spy;

      //   done();
      // }
      initializing: function () {
        console.log('now in initializing');
        console.log('args=' + this.args);
        this.fs.write('abc.txt', 'hello2');
        this.fs.write('app/scripts/services/def.js', 'hello2');
      },
      
      exec: this.spy,      
    });
    
    helpers.run(path.join(__dirname, '../generators/sub-angular'))
      .withOptions({ skipInstall: true, name: 'def' })
      .withArguments(['defg' ])
      //.withPrompts({ appName: 'vrtest' })
      //.withGenerators([ [helpers.createDummyGenerator(), 'angular:service'] ])
      .withGenerators([ [angularServiceDummy, 'angular:service'] ])
      //.withGenerators([ '/dummy-generators/angular/service' ])
      //.withGenerators([ '/dummy-generators/angular/service' ])
      .on('end', done);
  });

  // the beforeEach base dir is test/temp
  // vs 'it' stanzas, with base dir of test
  // beforeEach(function (done) {
  //   helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
  //     if (err) {
  //       return done(err);
  //     }

  //     console.log('now in beforeEach');
  //     // this.angular = helpers.createDummyGenerator('angular', [
  //     //   //'../../generators/angular-sub', [
  //     //   '../dummy-generators/angular', [
  //     //     helpers.createDummyGenerator(),
  //     //     'angular:service'
  //     //   ]
  //     // ]);
  //     this.angular = helpers.createDummyGenerator();

  //     this.angularSub = helpers.createGenerator('angular-sub', [
  //       '../../generators/angular-sub',
  //       // [
  //       // //'../dummy-generators/angular', [
  //       //   helpers.createDummyGenerator(),
  //       //   'angular:service'
  //       // ]
  //     ]);
      
  //   // helpers.run(path.join(__dirname, '../generators/angular'))
  //   //   .withOptions({ skipInstall: true, name: 'def' })
  //   //   .withArguments(['def' ])
  //   //   .on('end', done);
      
  //     done();
  //   }.bind(this));
  // });


  // Note: these files are not physically created by the unit test.  They only
  // get created in the logical in-memory file system
  it('creates files', function () {
    // assert.file([
    //   'bower.json',
    //   'package.json',
    //   '.editorconfig',
    //   '.jshintrc'
    // ]);
    console.log('now in it');
    //console.log('this.angular-sub=', this['angular-sub']);
    //console.log('this=', this);
    // this.angularSub.run(path.join(__dirname, '../generators/angular-sub'))
    //    .withOptions({ skipInstall: true, name: 'def' })
    //    .withArguments(['def' ])
    //    .on('end', done);

    //assert(this.spy.calledOnce);
    
    assert.file([
      'app/scripts/services/def.js',
    ]);
    assert.file([
      'abc.txt',
    ]);

    var result = fs.readFileSync('abc.txt');
    console.log('result=' + result);
  });
});
*/
// this will be the end to end test
describe('vr-base-dependent:sub-angular 2', function () {

  var vrBaseDependentSubAngularGenerator;
  // we want to create a real 'vr-base-dependent:sub-angular' so we can
  // unit test methods in there.
  // We also need to create a 
  // mock 'angular-service' since 'vr-base-dependent:sub-angular' calls
  // on it to create services and such.
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
    
    // create a real 'vr-base-dependent:sub-angular'
    //this.vrBaseDependentSubAngularGenerator = yeoman.generators.RunContext.createGenerator(
    vrBaseDependentSubAngularGenerator = helpers.createGenerator(
      'vr-base-dependent:sub-angular',
      [
        path.join(__dirname, '../generators/sub-angular')
        //'../generators/sub-angular'
      ]);

    var result = vrBaseDependentSubAngularGenerator.do_something();
    console.log('result of do_something=' + result);
    //this.vrBaseDependentSubAngularRunContext = new helpers.RunContext(
    // this.vrBaseDependentSubAngularRunContext = new helpers.test.RunContext(
    //   this.vrBaseDependentSubAngularGenerator)
    //     .withOptions({ skipInstall: true, name: 'def' })
    //     .withArguments(['defg' ])
    //     .withGenerators([ [angularServiceDummy, 'angular:service'] ]);
    var artifacts = {};
    artifacts.services = {};
    
    artifacts.services.main = 'main';
    artifacts.services.base = 'base';

    this.vrBaseDependentSubAngularRunContext = helpers.run(path.join(__dirname, '../generators/sub-angular'))
      .withOptions({ skipInstall: true,
                     name: 'def',
                     artifacts: artifacts,
                   })
      .withArguments(['defg' ])
      .withGenerators([ [angularServiceDummy, 'angular:service'] ])
      .on('end', done);


 });

  it('creates service files', function () {
    //console.log('do_something= ' + this.vrBaseDependentSubAngularRunContext.do_something());
    console.log('this.vrBaseDependentSubAngularRunContext.cwd=', this.vrBaseDependentSubAngularRunContext.options.env.cwd);
    //console.log('do_something= ' + this.vrBaseDependentSubAngularGenerator.do_something());
    assert.file([
      'app/scripts/services/main.js',
      'app/scripts/services/base.js',
    ]);

  });
    
});


// This will be for testing individual methods
// test under here cannot be used for any steps that need to
// call the base angular generator.  This is because 'createGenerator'
// has no way to pass a dummy 'angular:service'.  Only 'helpers.run'
// has this capability.  So any method that calls angular needs to be
// run from the prior (end-to-end) describe block.
describe('vr-base-dependent:sub-angular 3', function () {
  var subAngularGenerator;

  
  before(function (done) {
    var artifacts = {};
    artifacts.services = {};
    
    artifacts.services.main = 'main';
    artifacts.services.base = 'base';

    subAngularGenerator = helpers.createGenerator(
      'vr-base-dependent:sub-angular',
      [
        path.join(__dirname, '../generators/sub-angular')
        //'../generators/sub-angular'
      ],null, {abc: 7, def: 8, artifacts: artifacts})
      //.inTmpDir()
      ;

    //var result = subAngularGenerator.do_something();
    //console.log('result of do_something=' + result);

    // we need to do this to properly feed in options and args
    subAngularGenerator.initializing();

    // subAngularGenerator.sourceRoot(path.join(process.cwd(), 'test/temp') );
    // subAngularGenerator.options.env.cwd = path.join(process.cwd(), 'test/temp');
    
    subAngularGenerator.fs.write('file.txt', '//dummy-line\n  });\n');

    subAngularGenerator.fs.write('app/scripts/services/main.js', '//dummy-line\n  });\n');
    subAngularGenerator.fs.write('app/scripts/services/base.js', '//dummy-line\n  });\n');
    
    //console.log('this.vrBaseDependentSubAngularRunContext.cwd=', this.vrBaseDependentSubAngularRunContext.options.env.cwd);
    //console.log('mocha: __directory=' + process.cwd());
    console.log('subAngularGenerator.cwd=', subAngularGenerator.options.env.cwd);
    //console.log('subAngularGenerator=', subAngularGenerator);
    
    done();
  });
  

  it('createAngularServices', function () {
    var result;
    //result = subAngularGenerator.do_something();    
    //result = subAngularGenerator.do_something();
    subAngularGenerator._markupFile('file.txt');

    // note: need to read with subAngulargenerator's fs.  If you try to read with
    // the ut's fs, you'll get 'file not found'.  This is because the file is 'in-memory'
    // and is only known to the generator.
    result = subAngularGenerator.fs.read('file.txt');
    console.log('result=' + result);

    var regex = /\<\%\= stuff \%\>/;

    //console.log('regex test=' + regex.test(result));
    assert(regex.test(result));

  });   

  it('artifacts transformation pipeline', function () {
    var result;

    
    // markup artifacts
    subAngularGenerator.markupArtifacts();

    result = subAngularGenerator.fs.read('app/scripts/services/base.js');

    var regex = /\<\%\= stuff \%\>/;
    
    assert(regex.test(result));

    // partials injection
    subAngularGenerator.partialsInjection();

    result = subAngularGenerator.fs.read('app/scripts/services/base.js');
    //console.log('result after partialsInjection=' + result);
    var regex = /\<\%\= name \%\>/;
    
    assert(regex.test(result));

    // template Interpolation
    subAngularGenerator.writing();

    result = subAngularGenerator.fs.read('app/scripts/services/base.js');
    console.log('result after writing=' + result);
    var regex = /base\.js base/;
    
    assert(regex.test(result));

  });

  // it('partialsInjection', function () {
  //   var result;
    
  //   subAngularGenerator.partialsInjection();

  //   result = subAngularGenerator.fs.read('app/scripts/services/base.js');

  //   var regex = /\<\%\= name \%\>/;
    
  //   assert(regex.test(result));

  // });
});
