import { setupTest } from 'ember-gh-repos/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Adapter | Application', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const adapter = this.owner.lookup('adapter:application');
    assert.ok(adapter, 'adapter exists');
  });

  test('it has the correct host and namespace configuration', function (assert) {
    const adapter = this.owner.lookup('adapter:application');
    assert.strictEqual(adapter.host, '', 'host is empty string');
    assert.strictEqual(
      adapter.namespace,
      '.netlify/functions',
      'namespace is set correctly',
    );
  });

  test('buildURL returns the correct endpoint for repository', function (assert) {
    const adapter = this.owner.lookup('adapter:application');
    const url = adapter.buildURL('repository');
    assert.strictEqual(
      url,
      '/.netlify/functions/fetchGHRepos',
      'builds the correct URL',
    );
  });

  test('buildURL returns the correct endpoint for branch-count', function (assert) {
    const adapter = this.owner.lookup('adapter:application');
    const url = adapter.buildURL('branch-count');
    assert.strictEqual(
      url,
      '/.netlify/functions/fetchGHRepoBranchCount',
      'builds the correct URL',
    );
  });
});
