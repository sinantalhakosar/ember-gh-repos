import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class IndexController extends Controller {
  @tracked selectedLanguage = null;
  @tracked languages = [
    ...new Set(
      this.model.data.map((item) => item.language).filter((item) => !!item),
    ),
  ];

  get modelData() {
    if (!this.selectedLanguage) {
      return this.model.data;
    }

    return this.model.data.filter(
      (item) => item.language === this.selectedLanguage,
    );
  }

  @action
  handleLanguageChange(language) {
    this.selectedLanguage = language;
  }
}
