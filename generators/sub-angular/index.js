// 
// sub-angular subgenerator
//  created 2015-10-20
//
// all the logic specific to installing vr into an angular app
// should be placed here.
//

'use strict';
var _ = require('lodash');
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  do_something: function () {
    console.log('sub-angular: do_something this.artifacts=',this.artifacts);
    return 7;
  },
  
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('name', {
      required: true,
      desc: 'The new module name.'
    });

    this.option('babel', {
      required: false,
      defaults: false,
      desc: 'Compile ES2015 using Babel'
    });

    // this.artifacts = {};
    // this.artifacts.services = {};
    // this.artifacts.services.main = 'def';
    // this.artifacts.services.base = 'base.js';
  },

  initializing: function () {
    console.log('sub-angular: init options.artifacts=', this.options.artifacts);
    console.log('sub-angular: init args=' + this.args);

    this.artifacts = this.options.artifacts;
    // this.artifacts.services = {};
    // this.artifacts.services.main = 'def';
    // this.artifacts.services.base = 'base.js';
  },
  // writing: function () {
  //   this.fs.copyTpl(
  //     this.templatePath('index.js'),
  //     this.destinationPath('lib/index.js'), {
  //       babel: this.options.babel
  //     }
  //   );

  //   this.fs.copyTpl(
  //     this.templatePath('test.js'),
  //     this.destinationPath('test/index.js'), {
  //       pkgName: this.options.name,
  //       pkgSafeName: _.camelCase(this.options.name),
  //       babel: this.options.babel
  //     }
  //   );
  // }

  createAngularServices: function () {
    console.log('subgeneratorServices: entered');
    console.log('subgeneratorServices: this.args=' + this.args);
    console.log('subgeneratorServices:  services.main= ' + this.artifacts.services.main);
    Object.keys(this.artifacts.services).forEach( function (key, index, array) {
      console.log('subgeneratorServices:  key= ' + key);
      this.composeWith('angular:service',  {args: [ this.artifacts.services[key] ]} );
      
    }.bind(this));    
  },


  // helper method
  _markupFile: function (filePath) {
 // _injectTemplate: function (filePath) {
    var fileContents = this.fs.read(filePath);

    console.log('_markupFile: fileContents=' + fileContents);
    this.conflicter.force = true;

    // loop over each line looking for our insert point
    var lines = _.map(fileContents.split('\n'));

    var accumulateLines = function(str) {
      var result = '';

      // look for closing bracket, and insert our tag before this
      if (/^\s\s\}\);/.test(str)) {
        result +=  '<%= stuff %>' + '\n';   
      }
      result += str + '\n';

      return result;
      
    };

    // convert file string into an array of lines (including tagged line)
    var taggedLines = _.map(lines, accumulateLines);

    // convert the array back into a string so we can rewrite to the file
    fileContents = null;

    var strAccumulate = function(str) {
      fileContents += str;
    };

    _.map(taggedLines, strAccumulate);

    // and write it back
    this.fs.write(filePath, fileContents);
  },

  // insert tags into the base angular artifacts, so we can later inject our custom code
  markupArtifacts: function () {
    // services
    Object.keys(this.artifacts.services).forEach( function (key, index, array) {
      var filePath = this.destinationPath('app/scripts/services/' + [ this.artifacts.services[key] ] + '.js');
      console.log('markupArtifacts: filePath=' + filePath);
      this._markupFile(filePath);
    }.bind(this));
    
    // // controllers
    // Object.keys(this.artifacts.controllers).forEach( function (key, index, array) {
    //   var filePath = this.destinationPath('app/scripts/controllers/' + [ this.artifacts.controllers[key] ] + '.js');
    //   this._markupFile(filePath);
    // }.bind(this));

    // // directives
    // Object.keys(this.artifacts.directives).forEach( function (key, index, array) {
    //   var filePath = this.destinationPath('app/scripts/directives/' + [ this.artifacts.directives[key] ] + '.js');
    //   this._markupFile(filePath);
    // }.bind(this));
  },                                                 

  // inject partials into the template code
  partialsInjection: function () {

    Object.keys(this.artifacts.services).forEach( function (key, index, array) {
      var templatePath = this.destinationPath('app/scripts/services/' + [ this.artifacts.services[key] ] + '.js');
      var partialsPath = this.templatePath('../partials/services/' + [ this.artifacts.services[key] ] + '.js');

      console.log('partialsInjection: tempaltePath=' + templatePath);
      console.log('partialsInjection: partialsPath=' + partialsPath);
      //debugger;
      var partialContents = this.fs.read(partialsPath);

      partialContents += new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\n';
      this.fs.copyTpl(
        templatePath,
        templatePath,
        { stuff: partialContents}
      );
      
    }.bind(this));
    
  },

  // customize the dynamically created templates.
  // Dynamically created templates refers to the artifacts that have had the
  // '<%= stuff =>' tag replaced by the partial.  Now we need to replace any
  // tags were part of the partial.
  // Since the files are already in place, we only need to do an in place copy.
  // interpolateTemplates: function () {
    
  // },

  writing: function () {
    console.log('sub-angular: now in writing');
    Object.keys(this.artifacts.services).forEach( function (key, index, array) {
      var templatePath = this.destinationPath('app/scripts/services/' +
                                              [ this.artifacts.services[key] ] + '.js');

      this.fs.copyTpl(
        templatePath,
        templatePath, {
          name: key
        }
      );
    }.bind(this));
    // this.fs.copyTpl(
    //   this.templatePath('test.js'),
    //   this.destinationPath('test/index.js'), {
    //     pkgName: this.options.name,
    //     pkgSafeName: _.camelCase(this.options.name),
    //     babel: this.options.babel
    //   }
    // );
  }
  
  
});
