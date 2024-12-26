import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class GithubService extends Service {
  @service store;

  async fetchNetlify(organization) {
    try {
      const data = await this.store.query('repository', { organization });
      return { error: null, data };
    } catch (error) {
      return { error, data: null };
    }
  }
}
