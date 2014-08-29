Package.describe({
  summary: 'Controller class for dynamic layouts.',
  version: '0.4.0-rc0',
  git: 'https://github.com/eventedmind/iron-controller.git'
});

Package.on_use(function (api) {
  // dependencies
  api.use('underscore@1.0.0');

  // reactivity
  api.use('tracker@1.0.2-rc1');

  // reactive state variables
  api.use('reactive-dict@1.0.0');

  api.use('iron:core@0.3.2');
  api.imply('iron:core');

  api.use('iron:layout@0.4.0-rc0');
  api.use('iron:dynamic-template@0.4.0-rc0');

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
  api.use('tracker');
  api.use('templating');

  api.add_files('test/controller_test.html', 'client');
  api.add_files('test/wait_list_test.js', 'client');
  api.add_files('test/controller_test.js', 'client');
});
