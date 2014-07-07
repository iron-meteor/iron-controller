/**
 * XXX should get/set update a data context for the layout?
 *  Not if the layout is global. So what does get/set actually do? It just sets
 *  some state that can be used in the template?
 * XXX how do we get the controller from the template instance?
 */
/*****************************************************************************/
/* Client */
/*****************************************************************************/
if (Meteor.isClient) {
  var Layout = Iron.Layout;

  Controller = function (options) {
    ctor.apply(this, arguments);
    this._layout = this.options.layout || new Layout(this.options);
    this._waitlist = new WaitList;
    this._dict = new ReactiveDict;
  };

  Controller.prototype.layout = function (template) {
    return this._layout.template.apply(this._layout, arguments);
  };

  Controller.prototype.render = function (template, options) {
    return this._layout.render.apply(this._layout, arguments);
  };

  Controller.prototype.insert = function (options) {
    return this._layout.insert.apply(this._layout, arguments);
  };

  Controller.prototype.ready = function () {
    return this._waitlist.ready.apply(this._waitlist, arguments);
  };

  Controller.prototype.wait = function () {
    return this._waitlist.wait.apply(this._waitlist, arguments);
  };

  Controller.prototype.get = function (key) {
    return this._dict.get.apply(this._dict, arguments);
  };

  Controller.prototype.set = function (key, value) {
    return this._dict.set.apply(this._dict, arguments);
  };

  Controller.prototype.stop = function () {
    this._waitlist.stop();
  };
}

/*****************************************************************************/
/* Server */
/*****************************************************************************/
if (Meteor.isServer) {
  Controller = function (options) {
    ctor.apply(this, arguments);
  };

  // futures somehow. but not clear exactly what this means.
  Controller.prototype.wait = function () {
  };

  // is future ready?
  Controller.prototype.ready = function () {
  };
}

/*****************************************************************************/
/* Both */
/*****************************************************************************/
var ctor = function (options) {
  this.options = options || {};
};

Iron = Iron || {};
Iron.Controller = Controller;
