Tinytest.add('Controller - inheritance', function (test) {
  var calls = [];

  Parent = Iron.Controller.extend({
    parentProp: true
  });

  test.instanceOf(Parent.extend, Function);
  test.equal(Parent.__super__, Iron.Controller.prototype);
  test.isTrue(Parent.prototype.parentProp);

  Child = Parent.extend({
    childProp: true
  });

  test.instanceOf(Child.extend, Function);
  test.equal(Child.__super__, Parent.prototype);
  test.isTrue(Child.prototype.childProp);

  var c = new Child;
  test.isTrue(c.childProp);
  test.isTrue(c.parentProp);

  // test constructor overloading
  var calls = [];
  ChildB = Parent.extend({
    constructor: function () {
      calls.push('ChildB');
    }
  });

  var c = new ChildB;
  test.equal(calls.length, 1);
});
