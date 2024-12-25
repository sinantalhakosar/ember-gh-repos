import { setupTest } from 'ember-gh-repos/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | branch count', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('branch-count', {});
    assert.ok(model, 'model exists');
  });

  test('it has the correct attributes', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('branch-count', { branchCount: 5 });

    assert.strictEqual(
      model.branchCount,
      5,
      'branchCount attribute is correctly set',
    );
  });
});
