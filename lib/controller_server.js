Controller.prototype.init = function () {
  this._dict = {};
};

// futures somehow. but not clear exactly what this means.
Controller.prototype.wait = function () {
  throw new Error('Not implemented on server yet.');
};

// is future ready?
Controller.prototype.ready = function () {
  throw new Error('Not implemented on server yet.');
};

Controller.prototype.get = function (key) {
  return this._dict[key];
};

Controller.prototype.set = function (key, value) {
  this._dict[key] = value;
};
