import { setupTest } from 'ember-gh-repos/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | repository', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('repository', {});
    assert.ok(model, 'model exists');
  });

  test('it has the correct attributes', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('repository', {
      name: 'test-repo',
      html_url: 'https://github.com/test/test-repo',
      language: 'JavaScript',
      private: false,
    });

    assert.strictEqual(model.name, 'test-repo', 'name is set correctly');
    assert.strictEqual(
      model.html_url,
      'https://github.com/test/test-repo',
      'html_url is set correctly',
    );
    assert.strictEqual(
      model.language,
      'JavaScript',
      'language is set correctly',
    );
    assert.false(model.private, 'private flag is set correctly');
  });
});
