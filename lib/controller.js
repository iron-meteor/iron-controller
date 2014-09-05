/*****************************************************************************/
/* Imports */
/*****************************************************************************/
var debug = Iron.utils.debug('iron:controller');

/*****************************************************************************/
/* Private */
/*****************************************************************************/

/*****************************************************************************/
/* Controller */
/*****************************************************************************/
Controller = function (options) {
  var self = this;
  this.options = options || {};
  this.init(options);
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
