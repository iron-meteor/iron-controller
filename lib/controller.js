/*****************************************************************************/
/* Imports */
/*****************************************************************************/
var debug = Iron.utils.debug('iron:controller');
var Layout = Iron.Layout;

/*****************************************************************************/
/* Private */
/*****************************************************************************/
var bindData = function (value, thisArg) {
  return function () {
    return (typeof value === 'function') ? value.apply(thisArg, arguments) : value;
  };
};

/*****************************************************************************/
/* Controller */
/*****************************************************************************/
Controller = function (options) {
  var self = this;
  this.options = options || {};
  this._layout = this.options.layout || new Layout(this.options);
  this._layout.setController(this);
  this.init(options);
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
 * Inherit from Controller.
 *
 * Note: The inheritance function in Meteor._inherits is broken. Static
 * properties on functions don't get copied.
 */
Controller.extend = function (props) {
  return Iron.utils.extend(this, props); 
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

/*****************************************************************************/
/* Namespacing */
/*****************************************************************************/
Iron.Controller = Controller;
