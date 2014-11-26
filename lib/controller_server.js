Controller.prototype.init = function () {};

// futures somehow. but not clear exactly what this means.
Controller.prototype.wait = function () {
  console.warn('controller.wait() is not implemented on server yet. Please ensure you are running this only from the client.');
};

// is future ready?
Controller.prototype.ready = function () {
  console.warn('controller.ready() is not implemented on server yet. Please ensure you are running this only from the client.');
};
