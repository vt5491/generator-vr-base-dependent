//
// generator-vr-base-dependent: app
//
// created 2015-10-20
//
'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  _initGlobals: function (cb) {
    this.defaultArtifactNames = {};
    // services
    this.defaultArtifactNames.mainService = 'main';
    //this.defaultArtifactNames.mainSeorvice = 'mainservice';
    this.defaultArtifactNames.baseService = 'base';
    this.defaultArtifactNames.utilsService = 'utils';
    
    // controllers
    // note: main controller is gen'd by the angular generator, thus we comment it out
    // so we don't gen it again.
    //this.defaultArtifactNames.mainController = 'main';
    this.defaultArtifactNames.custController = 'cust';

    // directives
    this.defaultArtifactNames.canvasKeysDirective = 'canvas-keys';
    
    // this.abc = 8;
    // return 7;
    this.artifacts = {};
    this.artifacts.services = {};
    this.artifacts.controllers = {};
    this.artifacts.directives = {};
    
    // initialize service names
    //this.artifacts.services.mainService = this.defaultArtifactNames.mainService + '.js';
    this.artifacts.services.mainService = this.defaultArtifactNames.mainService;

    this.log('_initGlobals: this.artifacts.services.mainService=' + this.artifacts.services.mainService);
    this.artifacts.services.base = this.defaultArtifactNames.baseService;
    this.artifacts.services.utils = this.defaultArtifactNames.utilsService;

    // initialize controller names
    this.artifacts.controllers.cust = this.defaultArtifactNames.custController;
    
    // initialize directive names
    this.artifacts.directives.canvasKeys = this.defaultArtifactNames.canvasKeysDirective;

    //TODO: make this customizable e.g via options
    this.skipInstall = true;
  },

  initializing: function () {
    // console.log('sub-angular: init options.artifacts=', this.options.artifacts);
    // console.log('sub-angular: init args=' + this.args);

    this._initGlobals();
  },
  
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('VrBaseDependent') + ' generator.'
    ));

    var prompts = [{
          type: 'input',
          name: 'appName',
          message: 'What is your app\'s name (example: sketchvr) ?'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;      
      this.appName = props.appName;

      done();
    }.bind(this));
  },

  
  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    },

    // partials: function () {
    //   this.fs.copy(
    //     this.templatePath('../partials/services/base.js'),
    //     this.destinationPath('app/scripts/services/' + this.appName + '.js')
    //   );
    // },
    
  },

  default: function () {
    this.log('base-dependent.default: now installing sub-angular');
    //if (this.options.travis) {
    if (true) {
      // var artifacts = {};
      // artifacts.services = {};
      
      // artifacts.services.main = 'main';
      // artifacts.services.base = 'base';

      this.composeWith('vr-base-dependent:sub-angular',{options: {artifacts: this.artifacts}}, {
        local: require.resolve('../sub-angular')
      });
    }
    this.log('base-dependent.default: done installing sub-angular');
  },
  
  install: function () {
    this.log('base-dependent.install: skipInstall=' + this.skipInstall);
    if( !this.skipInstall) {
      this.log('base-dependent.install: now calling installDependencies');
      this.installDependencies();      
    };
  }
});
