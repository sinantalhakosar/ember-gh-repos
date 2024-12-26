import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RepoFilterIndex extends Component {
  @tracked organization = '';
  @tracked githubToken =
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('github_token='))
      ?.split('=')[1] || '';
  @tracked disableSearch = false;

  constructor() {
    super(...arguments);
    this.organization = this.args.organization || '';
  }

  @action
  handleTokenChange(event) {
    this.githubToken = event.target.value;
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
    if (!this.githubToken || !this.organization) {
      this.disableSearch = true;
      return;
    }

    this.disableSearch = false;

    let queryParams = {
      organization: this.organization,
    };

    const tokenFromCookie =
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('github_token='))
        ?.split('=')[1] || '';

    // We need hard reload if the token has changed
    if (tokenFromCookie !== this.githubToken) {
      document.cookie = `github_token=${this.githubToken}; path=/;`;
      this.args.onSearch(queryParams, true);
    } else {
      this.args.onSearch(queryParams, false);
    }
  }

  @action
  handleTypeChange(checkboxType) {
    let newType = '';
    if (this.args.selectedType === 'all') {
      newType = checkboxType === 'private' ? 'public' : 'private';
    } else if (this.args.selectedType === 'private') {
      newType = checkboxType === 'private' ? undefined : 'all';
    } else if (this.args.selectedType === 'public') {
      newType = checkboxType === 'private' ? 'all' : undefined;
    } else {
      newType = checkboxType;
    }

    this.args.onTypeChange(newType);
  }

  @action
  handleLanguageChange(event) {
    this.args.onLanguageChange(event.target.value);
  }
}
