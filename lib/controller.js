/*****************************************************************************/
/* Imports */
/*****************************************************************************/
var debug = Iron.utils.debug('iron:controller');
var Layout = Iron.Layout;
var DynamicTemplate = Iron.DynamicTemplate;

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
  this._isController = true;
  this._layout._setLookupHost(this);

  // grab the event map from the Controller constructor which was
  // set if the user does MyController.events({...});
  this._layout.events(this.constructor._eventMap, this);

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

/*****************************************************************************/
/* Controller Static Methods */
/*****************************************************************************/
/**
 * Inherit from Controller.
 *
 * Note: The inheritance function in Meteor._inherits is broken. Static
 * properties on functions don't get copied.
 */
Controller.extend = function (props) {
  return Iron.utils.extend(this, props); 
};

Controller.events = function (events) {
  this._eventMap = events;
  return this;
};

Controller._helpers = {};
Controller.helpers = function (helpers) {
  //XXX for some reason the _helpers object is not cloned
  _.extend(this._helpers, helpers);
  return this;
};

/*****************************************************************************/
/* Global Helpers */
/*****************************************************************************/
if (typeof Template !== 'undefined') {
  /**
   * Returns the nearest controller for a template instance. You can call this
   * function from inside a template helper.
   *
   * Example:
   * Template.MyPage.helpers({
   *   greeting: function () {
   *    var controller = Iron.controller();
   *    return controller.state.get('greeting');
   *   }
   * });
   */
  Iron.controller = function () {
    return DynamicTemplate.findLookupHostWithProperty(Blaze.getView(), '_isController');
  };

  /**
   * Find a lookup host with a state key and return it reactively if we have
   * it.
   */
  Template.registerHelper('get', function (key) {
    var controller = Iron.controller();
    if (controller && controller.state)
      return controller.state.get(key);
  });
}
/*****************************************************************************/
/* Namespacing */
/*****************************************************************************/
Iron.Controller = Controller;
