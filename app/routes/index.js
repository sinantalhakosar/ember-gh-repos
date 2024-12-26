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
      const { data, error } = await this.github.fetchNetlify(
        params.organization,
        params.type,
      );

      if (error) {
        const rateLimitExceeded = error.errors.some(
          (error) => error.status === '429',
        );

        return {
          organization: params.organization,
          type: 'all',
          data,
          error: rateLimitExceeded
            ? 'rate_limit_exceeded'
            : 'failed_to_fetch_repositories',
        };
      }

      return {
        organization: params.organization,
        type: params.type || 'all',
        data,
        error,
      };
    } catch (error) {
      return {
        organization: params.organization,
        type: 'all',
        data: undefined,
        error,
      };
    }
  }
}
