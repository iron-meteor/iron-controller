if (Meteor.isClient) {
  c = new Iron.Controller;

  Meteor.startup(function () {
    c.insert({el: document.body});  
    c.layout('MasterLayout');
  });
}
