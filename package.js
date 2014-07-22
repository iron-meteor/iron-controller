Package.describe({
  summary: 'Controller class for dynamic layouts.',
  version: '0.1.0',
  git: 'https://github.com/eventedmind/iron-controller.git'
});

Package.on_use(function (api) {
  // dependencies
  api.use('underscore');

  // for helpers like Meteor._inherit
  api.use('meteor');

  // for the UI namespace
  api.use('ui');

  // reactivity
  api.use('deps');

  // reactive state variables
  api.use('reactive-dict');

  api.use('iron:core');
  api.imply('iron:core');

  api.use('iron:layout');
  api.use('iron:dynamic-template');

  api.addFiles('lib/wait_list.js', 'client');
  api.addFiles('lib/controller.js', ['client', 'server']);
});

Package.on_test(function (api) {
  api.use('iron:controller');
  api.use('tinytest');
  api.use('test-helpers');
  api.use('deps');

  api.addFiles('test/wait_list_test.js', 'client');
  api.addFiles('test/controller_test.js', 'client');
});
