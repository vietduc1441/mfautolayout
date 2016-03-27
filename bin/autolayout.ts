#!/usr/bin/env node

const Liftoff = require('liftoff');
const argv = require('minimist')(process.argv.slice(2));

const mxmf = new Liftoff({
  name: 'mfautolayout',
  moduleName:'mfautolayout',
  configName: 'config',
  extensions: require('interpret').jsVariants,
  v8flags: ['--harmony'] // to support all flags: require('v8flags')
 }).on('require', function (name, module) {
  console.log('Loading:',name);
}).on('requireFail', function (name, err) {
  console.log('Unable to load:', name, err);
}).on('respawn', function (flags, child) {
  console.log('Detected node flags:', flags);
  console.log('Respawned to PID:', child.pid);
});

mxmf.launch({
  cwd: argv.cwd,
  configPath: argv.mfautolayout,
  require: argv.require,
  completion: argv.completion,
  verbose: argv.verbose
}, invoke);

function invoke (env) {
  if (argv.verbose) {
    console.log('LIFTOFF SETTINGS:', this);
    console.log('CLI OPTIONS:', argv);
    console.log('CWD:', env.cwd);
    console.log('LOCAL MODULES PRELOADED:', env.require);
    console.log('SEARCHING FOR:', env.configNameRegex);
    console.log('FOUND CONFIG AT:',  env.configPath);
    console.log('CONFIG BASE DIR:', env.configBase);
    console.log('YOUR LOCAL MODULE IS LOCATED:', env.modulePath);
    console.log('LOCAL PACKAGE.JSON:', env.modulePackage);
    console.log('CLI PACKAGE.JSON', require('../package'));
  }
  if (process.cwd() !== env.cwd) {
    process.chdir(env.cwd);
    console.log('Working directory changed to', env.cwd);
  }
  if (!env.modulePath) {
    console.log('Local ', mxmf.moduleName, ' module not found in: ', env.cwd);
    process.exit(1);
  }
  if (env.configPath) {
    var config=require(env.configPath);
    var autolayout=require("../main");
    autolayout.autolayoutThenCommit(config, argv._);

  } else {
    console.log('No ', mxmf.configName, ' found.');
  }
}