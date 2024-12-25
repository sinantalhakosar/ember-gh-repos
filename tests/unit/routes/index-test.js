import { module, test } from 'qunit';
import { setupTest } from 'ember-gh-repos/tests/helpers';

module('Unit | Route | index', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:index');
    assert.ok(route);
  });

  test('model hook returns data = null if organization parameter empty', async function (assert) {
    const route = this.owner.lookup('route:index');

    const model = await route.model({});
    assert.deepEqual(
      model,
      { organization: '', data: null, type: 'all' },
      'returns default model when organization parameter is missing',
    );
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
      model.data[0].name,
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

    const model = await route.model({ organization: 'test-org' });
    assert.deepEqual(
      model,
      { organization: 'test-org', type: 'all', data: undefined },
      'returns model with data as undefined when service errors',
    );
  });
});
