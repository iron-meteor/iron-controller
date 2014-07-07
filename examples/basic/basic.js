if (Meteor.isClient) {
  ReadyHandle = function () {
    this._ready = false;
    this._dep = new Deps.Dependency;
  };

  ReadyHandle.prototype.set = function (value) {
    this._ready = value;
    this._dep.changed();
  };

  ReadyHandle.prototype.ready = function () {
    this._dep.depend();
    return this._ready;
  };

  list = new Iron.WaitList;

  h1 = new ReadyHandle;
  h2 = new ReadyHandle;
  h3 = new ReadyHandle;

  Deps.autorun(function (c) {
    var ready = list.ready();
    console.log('ready: ', ready);
  });

  comp = Deps.autorun(function (c) {
    list.wait(function () { return h1.ready(); });
    list.wait(function () { return h2.ready(); });
  });
}
