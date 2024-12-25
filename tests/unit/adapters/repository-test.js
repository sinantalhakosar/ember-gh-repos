import { setupTest } from 'ember-gh-repos/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Adapter | repository', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const adapter = this.owner.lookup('adapter:repository');
    assert.ok(adapter, 'adapter exists');
  });

  test('it has the correct host and namespace configuration', function (assert) {
    const adapter = this.owner.lookup('adapter:repository');
    assert.strictEqual(adapter.host, '', 'host is empty string');
    assert.strictEqual(
      adapter.namespace,
      '.netlify/functions',
      'namespace is set correctly',
    );
  });

  test('buildURL returns the correct endpoint', function (assert) {
    const adapter = this.owner.lookup('adapter:repository');
    const url = adapter.buildURL();
    assert.strictEqual(
      url,
      '/.netlify/functions/fetchGHRepos',
      'builds the correct URL',
    );
  });
});
