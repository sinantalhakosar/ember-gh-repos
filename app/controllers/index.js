import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class IndexController extends Controller {
  @service router;

  @tracked selectedLanguage = null;
  @tracked type = 'all';
  @tracked languages = [
    ...new Set(
      this.model.data.map((item) => item.language).filter((item) => !!item),
    ),
  ];

  get modelData() {
    let data = this.model.data;

    if (this.selectedLanguage) {
      data = data.filter((item) => item.language === this.selectedLanguage);
    }

    if (this.type === 'public') {
      data = data.filter((item) => item.private === false);
    }

    if (this.type === 'private') {
      data = data.filter((item) => item.private === true);
    }

    return data;
  }

  @action
  handleLanguageChange(language) {
    this.selectedLanguage = language;
  }

  @action
  handleTypeChange(type) {
    this.type = type;
  }

  @action
  handleSearch(queryParams, hardReload = false) {
    /*
      We will be prioritizing the token from the cookies over token in env variables in server.
    */
    if (hardReload) {
      this.router.transitionTo({ queryParams }).then(() => {
        window.location.reload();
      });
    } else {
      this.router.transitionTo({ queryParams });
    }
  }
}
