Package.describe({
  summary: 'Controller class for dynamic layouts.',
  version: '0.2.0',
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

  api.use('iron:core@0.3.2');
  api.imply('iron:core');

  api.use('iron:layout@0.3.0');
  api.use('iron:dynamic-template@0.3.0');

  api.add_files('lib/wait_list.js', 'client');
  api.add_files('lib/controller.js');

  api.add_files('lib/controller_server.js', 'server');
  api.add_files('lib/controller_client.js', 'client');
});

Package.on_test(function (api) {
  api.use('iron:controller');
  api.use('iron:layout');
  api.use('tinytest');
  api.use('test-helpers');
  api.use('deps');
  api.use('templating');

  api.add_files('test/controller_test.html', 'client');
  api.add_files('test/wait_list_test.js', 'client');
  api.add_files('test/controller_test.js', 'client');
});
