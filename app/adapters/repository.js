import RESTAdapter from '@ember-data/adapter/rest';

export default class RepositoryAdapter extends RESTAdapter {
  host = '';
  namespace = '.netlify/functions';

  buildURL() {
    return `${this.host}/${this.namespace}/fetchGHRepos`;
  }
}
