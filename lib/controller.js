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
    this._layout.onCreated(function (view) {
      view.controller = self;
    });

    // allow access to the controller instance from region template helper
    // methods using UI.controller()
    this._layout.onRegionCreated(function (region, dynamicTemplate, layout) {
      var view = this;
      view.controller = self;
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
    // is this an object with a ready function like a subscription?
    if (fn.ready)
      return this._waitlist.wait(function () { return fn.ready(); });
    // otherwise just pass the function directly and the fn can return true or
    // false.
    else
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
   * Begin recording rendered regions.
   */
  Controller.prototype.beginRendering = function () {
    this._layout.beginRendering();
  };

  /**
   * End recording rendered regions and return them like this:
   * {
   *  "main": true,
   *  "footer": true
   * }
   *
   * Note: Calls Deps.flush().
   */
  Controller.prototype.endRendering = function () {
    return this._layout.endRendering();
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

    var view = inst.__view__;

    while (view) {
      if (view.controller)
        return view.controller
      else
        view = view.parentView;
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

/**
 * Inherit from Controller.
 *
 * Note: The inheritance function in Meteor._inherits is broken. Static
 * properties on functions don't get copied.
 */
Controller.extend = function (props) {
  return Iron.utils.extend(this, props); 
};

Iron.Controller = Controller;
