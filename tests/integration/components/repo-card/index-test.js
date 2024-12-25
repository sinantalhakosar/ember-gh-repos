import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-gh-repos/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | repo-card/index', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders repository information correctly', async function (assert) {
    this.setProperties({
      repo_name: 'test-repo',
      repo_url: 'https://github.com/test/test-repo',
      is_private: false,
      description: 'Test repository description',
    });

    await render(hbs`
      <RepoCard
        @repo_name={{this.repo_name}}
        @repo_url={{this.repo_url}}
        @is_private={{this.is_private}}
        @description={{this.description}}
      />
    `);

    assert.dom('a').hasText('test-repo', 'displays repository name');
    assert
      .dom('a')
      .hasAttribute(
        'href',
        'https://github.com/test/test-repo',
        'has correct repository URL',
      );
    assert
      .dom('.text-sm.text-gray-400')
      .hasText('Test repository description', 'displays description');
  });

  test('it toggles private/public label correctly', async function (assert) {
    this.setProperties({
      repo_name: 'test-repo',
      repo_url: 'https://github.com/test/test-repo',
      is_private: true,
      description: 'Test repository description',
    });

    await render(hbs`
      <RepoCard
        @repo_name={{this.repo_name}}
        @repo_url={{this.repo_url}}
        @is_private={{this.is_private}}
        @description={{this.description}}
      />
    `);

    assert.dom('span').hasText('Private', 'shows private status');
  });
});
