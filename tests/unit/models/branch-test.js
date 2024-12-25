import { setupTest } from 'ember-gh-repos/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | branch', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('branch', {});
    assert.ok(model, 'model exists');
  });

  test('it has the correct attributes', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('branch', { name: 'master' });

    assert.strictEqual(
      model.name,
      'master',
      'branch name attribute is correctly set',
    );
  });
});
