import { module, test } from 'qunit';
import { setupTest } from 'ember-gh-repos/tests/helpers';

module('Unit | Service | github', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:github');
    assert.ok(service);
  });

  test('fetchNetlify makes the correct store query', async function (assert) {
    const service = this.owner.lookup('service:github');
    const store = this.owner.lookup('service:store');

    store.query = function (modelName, query) {
      assert.strictEqual(modelName, 'repository', 'correct model name is used');
      assert.deepEqual(
        query,
        { organization: 'test-org' },
        'correct query parameters are passed',
      );
      return Promise.resolve([]);
    };

    await service.fetchNetlify('test-org');
  });

  test('fetchNetlify handles errors', async function (assert) {
    const service = this.owner.lookup('service:github');
    const store = this.owner.lookup('service:store');

    store.query = function () {
      return Promise.reject(new Error('API Error'));
    };

    const result = await service.fetchNetlify('test-org');
    assert.strictEqual(
      result.error.message,
      'API Error',
      'error is propagated correctly',
    );
  });
});
