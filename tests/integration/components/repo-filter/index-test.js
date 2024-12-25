import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';
import { render, fillIn, triggerKeyEvent, click } from '@ember/test-helpers';
import Service from '@ember/service';

module('Integration | Component | repo-filter/index', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'service:router',
      class MockRouterService extends Service {
        currentRoute = { queryParams: {} };
        queryParams = {};
        transitionTo() {}
      },
    );
  });

  test('it renders and updates organization on input', async function (assert) {
    await render(hbs`<RepoFilter @organization="octokit" />`);

    assert.dom('input#organization').hasValue('octokit');

    await fillIn('input#organization', 'emberjs');
    assert.dom('input#organization').hasValue('emberjs');
  });

  test('it triggers search on Enter key press', async function (assert) {
    this.set('search', () => {
      assert.ok(true, 'search action was called');
    });

    await render(hbs`<RepoFilter @organization="octokit" />`);

    await fillIn('input#organization', 'emberjs');
    await triggerKeyEvent('input#organization', 'keydown', 'Enter');
    assert.dom('input#organization').hasValue('emberjs');
  });

  test('it triggers search on button click', async function (assert) {
    this.set('search', () => {
      assert.ok(true, 'search action was called');
    });

    await render(hbs`<RepoFilter @organization="octokit" />`);

    await fillIn('input#organization', 'emberjs');
    await click('button');
    assert.dom('input#organization').hasValue('emberjs');
  });
});
