import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class GithubService extends Service {
  @service store;

  async fetchNetlify(organization, type) {
    try {
      return await this.store.query('repository', { organization, type });
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  }
}
