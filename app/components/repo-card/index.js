import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class RepoCardIndex extends Component {
  @service store;
  @tracked collapse = true;
  @tracked branchCount = null;
  @tracked isBranchCountLoading = false;
  @tracked branches = null;
  @tracked isBranchesLoading = false;

  constructor() {
    super(...arguments);
    this.fetchBranchCount();
  }

  @action
  async toggle() {
    this.collapse = !this.collapse;

    if (!this.collapse && this.branches === null) {
      await this.fetchBranches();
    }
  }

  async fetchBranchCount() {
    try {
      this.isBranchCountLoading = true;
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
      this.isBranchCountLoading = false;
    }
  }

  async fetchBranches() {
    try {
      this.isBranchesLoading = true;
      const { owner, repo_name } = this.args;

      const branches = await this.store.query('branch', {
        owner,
        repository: repo_name,
      });

      this.branches = branches.map((b) => b.name);
    } catch (error) {
      console.error('Error fetching branch count:', error);
      this.error = 'Failed to fetch branch count';
    } finally {
      this.isBranchesLoading = false;
    }
  }
}
