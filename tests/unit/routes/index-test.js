import { module, test } from 'qunit';
import { setupTest } from 'ember-gh-repos/tests/helpers';

module('Unit | Route | index', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:index');
    assert.ok(route);
  });

  test('model hook requires organization parameter', async function (assert) {
    const route = this.owner.lookup('route:index');

    try {
      await route.model({});
      assert.notOk(true, 'should have thrown an error');
    } catch (error) {
      assert.strictEqual(
        error.message,
        'Organization query parameter is required',
        'throws correct error message',
      );
    }
  });

  test('model hook fetches repositories for organization', async function (assert) {
    const route = this.owner.lookup('route:index');
    const github = this.owner.lookup('service:github');

    github.fetchNetlify = function (org) {
      assert.strictEqual(
        org,
        'test-org',
        'fetchNetlify called with correct organization',
      );
      return Promise.resolve([{ name: 'test-repo' }]);
    };

    const model = await route.model({ organization: 'test-org' });
    assert.ok(model, 'model is returned');
    assert.strictEqual(
      model[0].name,
      'test-repo',
      'model contains correct data',
    );
  });

  test('model hook handles service errors', async function (assert) {
    const route = this.owner.lookup('route:index');
    const github = this.owner.lookup('service:github');

    github.fetchNetlify = function () {
      return Promise.reject(new Error('Service Error'));
    };

    try {
      await route.model({ organization: 'test-org' });
      assert.notOk(true, 'should have thrown an error');
    } catch (error) {
      assert.strictEqual(
        error.message,
        'Service Error',
        'error is propagated correctly',
      );
    }
  });
});
