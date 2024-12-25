import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class RepoFilterIndex extends Component {
  @service router;
  @tracked organization = '';

  constructor() {
    super(...arguments);
    this.organization = this.args.organization || '';
  }

  @action
  handleOrganizationChange(event) {
    this.organization = event.target.value;
  }

  @action
  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  @action
  search() {
    this.router.transitionTo({
      queryParams: { organization: this.organization },
    });
  }
}
