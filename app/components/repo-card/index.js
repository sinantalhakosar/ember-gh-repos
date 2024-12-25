import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class RepoCardIndex extends Component {
  @service store;
  @tracked collapse = true;
  @tracked branchCount = null;

  constructor() {
    super(...arguments);
    this.fetchBranchCount();
  }

  @action
  async toggle() {
    this.collapse = !this.collapse;
  }

  async fetchBranchCount() {
    try {
      this.isLoading = true;
      this.error = null;

      const { owner, repo_name } = this.args;

      const repo = await this.store.queryRecord('branch-count', {
        owner,
        repository: repo_name,
      });

      this.branchCount = repo.branchCount;
    } catch (error) {
      console.error('Error fetching branch count:', error);
      this.error = 'Failed to fetch branch count';
    } finally {
      this.isLoading = false;
    }
  }
}
