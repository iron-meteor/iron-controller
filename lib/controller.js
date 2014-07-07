/*****************************************************************************/
/* Client */
/*****************************************************************************/
if (Meteor.isClient) {
  var Layout = Iron.Layout;

  Controller = function (options) {
    var self = this;

    ctor.apply(this, arguments);
    this._layout = this.options.layout || new Layout(this.options);
    this._waitlist = new WaitList;
    this._dict = new ReactiveDict;

    // allow access to the controller instance from the layout's template helper
    // methods using UI.controller()
    this._layout.onRender(function (layout, component) {
      component.controller = self;
    });

    // allow access to the controller instance from region template helper
    // methods using UI.controller()
    this._layout.onRenderRegion(function (layout, region, dynamicTemplate, component) {
      component.controller = self;
    });
  };

  /**
   * Set or get the layout's template.
   */
  Controller.prototype.layout = function (template) {
    return this._layout.template.apply(this._layout, arguments);
  };

  /**
   * Render a template into a region of the layout.
   */
  Controller.prototype.render = function (template, options) {
    return this._layout.render.apply(this._layout, arguments);
  };

  /**
   * Insert the controller's layout into the DOM.
   */
  Controller.prototype.insert = function (options) {
    return this._layout.insert.apply(this._layout, arguments);
  };

  /**
   * Add an item to the waitlist.
   */
  Controller.prototype.wait = function (fn) {
    return this._waitlist.wait(fn);
  };

  /**
   * Returns true if all items in the waitlist are ready.
   */
  Controller.prototype.ready = function () {
    return this._waitlist.ready();
  };

  /**
   * Get a reactive variable value.
   */
  Controller.prototype.get = function (key) {
    return this._dict.get.apply(this._dict, arguments);
  };

  /**
   * Set a reactive variable value.
   */
  Controller.prototype.set = function (key, value) {
    return this._dict.set.apply(this._dict, arguments);
  };

  Controller.prototype.stop = function () {
    this._waitlist.stop();
  };

  /**
   * Returns the nearest controller for a template instance. You can call this
   * function from inside a template helper.
   *
   * Example:
   * Template.MyPage.helpers({
   *   greeting: function () {
   *    var controller = UI.controller();
   *    return controller.get('greeting');
   *   }
   * });
   */
  UI.controller = function () {
    var inst = UI._templateInstance();

    if (!inst)
      throw new Error("No template instance.");

    var cmp = inst.__component__;

    while (cmp) {
      if (cmp.controller)
        return cmp.controller
      else
        cmp = cmp.parent;
    }

    return null;
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
    return true;
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
