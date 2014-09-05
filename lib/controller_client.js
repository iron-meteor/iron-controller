/*****************************************************************************/
/* Imports */
/*****************************************************************************/
var Layout = Iron.Layout;
var debug = Iron.utils.debug('iron:controller');

/*****************************************************************************/
/* Private */
/*****************************************************************************/
var bindData = function (value, thisArg) {
  return function () {
    return (typeof value === 'function') ? value.apply(thisArg, arguments) : value;
  };
};

/*****************************************************************************/
/* Controller Client */
/*****************************************************************************/
/**
 * Client specific init code.
 */
Controller.prototype.init = function (options) {
  this._layout = this.options.layout || new Layout(this.options);
  this._layout.setController(this);
  this._waitlist = new WaitList;
  this._dict = new ReactiveDict;
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
  var self = this;

  if (!fn)
    // it's possible fn is just undefined but we'll just return instead
    // of throwing an error, to make it easier to call this function
    // with waitOn which might not return anything.
    return;

  if (_.isArray(fn)) {
    _.each(fn, function eachWait (fnOrHandle) {
      self.wait(fnOrHandle);
    });
  } else if (fn.ready) {
    this._waitlist.wait(function () { return fn.ready(); });
  } else {
    this._waitlist.wait(fn);
  }

  return this;
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
 * Begin recording rendered regions.
 */
Controller.prototype.beginRendering = function (onComplete) {
  return this._layout.beginRendering(onComplete);
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

/*****************************************************************************/
/* Global Helpers */
/*****************************************************************************/

/**
 * Returns the nearest controller for a template instance. You can call this
 * function from inside a template helper.
 *
 * Example:
 * Template.MyPage.helpers({
 *   greeting: function () {
 *    var controller = Iron.controller();
 *    return controller.get('greeting');
 *   }
 * });
 */
Iron.controller = function () {
  var view = UI.getView();

  if (!view)
    throw new Error("No view found.");

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

  debug("No Iron.controller()");
  return null;
};
