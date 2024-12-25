import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service github;

  queryParams = {
    organization: { refreshModel: true },
    type: { refreshModel: true },
  };

  async model(params) {
    if (!params.organization) {
      return {
        organization: '',
        type: 'all',
        data: null,
      };
    }

    try {
      const data = await this.github.fetchNetlify(
        params.organization,
        params.type,
      );

      return {
        organization: params.organization,
        type: params.type || 'all',
        data,
      };
    } catch (error) {
      return {
        organization: params.organization,
        type: 'all',
        data: undefined,
      };
    }
  }
}
