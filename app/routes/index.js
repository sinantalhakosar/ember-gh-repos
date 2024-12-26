import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service github;

  queryParams = {
    organization: { refreshModel: true },
  };

  async model(params) {
    if (!params.organization) {
      return {
        organization: '',
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

        const apiKeyMissing = error.errors.some(
          (error) => error.status === '401',
        );

        return {
          organization: params.organization,
          data,
          error: rateLimitExceeded
            ? 'rate_limit_exceeded'
            : apiKeyMissing
              ? 'api_key_missing'
              : 'failed_to_fetch_repositories',
        };
      }

      return {
        organization: params.organization,
        data,
        error,
      };
    } catch (error) {
      return {
        organization: params.organization,
        data: undefined,
        error,
      };
    }
  }
}
