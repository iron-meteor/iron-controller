Package.describe({
  summary: 'Controller class for dynamic layouts.',
  version: '0.1.0',
  githubUrl: 'https://github.com/eventedmind/iron-controller'
});

Package.on_use(function (api) {
  // dependencies
  api.use('underscore');

  // for helpers like Meteor._inherit
  api.use('meteor');

  // for the UI namespace
  api.use('ui');

  // reactive state variables
  api.use('reactive-dict');

  api.use('iron-layout');
  api.use('iron-dynamic-template');

  api.add_files('lib/wait_list.js', 'client');
  api.add_files('lib/controller.js');

  // symbol exports
  api.export('Iron');
});

Package.on_test(function (api) {
  api.use('iron-controller');
  api.use('tinytest');
  api.use('test-helpers');

  api.add_files('test/wait_list_test.js', 'client');
  api.add_files('test/controller_test.js', 'client');
});
