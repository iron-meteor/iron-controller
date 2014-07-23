/*****************************************************************************/
/* Imports */
/*****************************************************************************/
var debug = Iron.utils.debug('iron:controller');

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
    this._layout.setController(this);
  };

  /**
   * Set or get the layout's template and optionally its data context.
   */
  Controller.prototype.layout = function (template, options) {
    var result = this._layout.template(template);

    // check whether options has a data property
    if (options && (_.has(options, 'data')))
      this._layout.data(bindData(options.data, this));

    return result;
  };

  /**
   * Render a template into a region of the layout.
   */
  Controller.prototype.render = function (template, options) {
    if (options && (typeof options.data !== 'undefined'))
      options.data = bindData(options.data, this);
    return this._layout.render(template, options);
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
    if (!fn)
      throw new Error("wait can only be called with a function or object");

    // is this an object with a ready function like a subscription handle?
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
      // find the first view that has a controller assigned to it.
      // if we find one, return its value reactively so that if it
      // changes, any helpers that use it will be invalidated on the
      // change.
      if (view.__dynamicTemplate__ && view.__dynamicTemplate__.hasController())
        return view.__dynamicTemplate__.getController();
      else
        view = view.parentView;
    }

    debug("No UI.controller()");
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

var bindData = function (value, thisArg) {
  return function () {
    return (typeof value === 'function') ? value.apply(thisArg, arguments) : value;
  };
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
