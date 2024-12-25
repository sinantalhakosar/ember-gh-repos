import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service github;

  queryParams = {
    organization: { refreshModel: true },
  };

  async model(params) {
    if (!params.organization) {
      throw new Error('Organization query parameter is required');
    }

    const data = await this.github.fetchNetlify(params.organization);
    return {
      organization: params.organization,
      data,
    };
  }
}
