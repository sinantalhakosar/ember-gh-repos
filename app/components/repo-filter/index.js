import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class RepoFilterIndex extends Component {
  @service router;
  @tracked organization = '';
  @tracked type = 'all';

  constructor() {
    super(...arguments);
    this.organization = this.args.organization || '';
  }

  @action
  handleTokenChange(event) {
    document.cookie = `github_token=${event.target.value}; path=/; secure; HttpOnly`;
  }

  @action
  handleOrganizationChange(event) {
    this.organization = event.target.value;
  }

  @action
  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  }

  @action
  handleSearch() {
    let queryParams = {
      ...this.router.currentRoute.queryParams,
      organization: this.organization,
    };
    this.router.transitionTo({ queryParams });
  }

  @action
  handleTypeChange(checkboxType) {
    if (this.type === 'all') {
      this.type = checkboxType === 'private' ? 'public' : 'private';
    } else if (this.type === 'private') {
      this.type = checkboxType === 'private' ? undefined : 'all';
    } else if (this.type === 'public') {
      this.type = checkboxType === 'private' ? 'all' : undefined;
    } else {
      this.type = checkboxType;
    }

    let queryParams = {
      ...this.router.currentRoute.queryParams,
      type: this.type,
    };
    this.router.transitionTo({ queryParams });
  }

  @action
  handleLanguageChange(event) {
    this.args.onLanguageChange(event.target.value);
  }
}
