import RESTAdapter from '@ember-data/adapter/rest';

export default class ApplicationAdapter extends RESTAdapter {
  host = '';
  namespace = '.netlify/functions';

  buildURL(modelName) {
    switch (modelName) {
      case 'repository':
        return `${this.host}/${this.namespace}/fetchGHRepos`;
      case 'branch-count':
        return `${this.host}/${this.namespace}/fetchGHRepoBranchCount`;
      default:
        return super.buildURL(...arguments);
    }
  }
}
