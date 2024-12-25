import RESTSerializer from '@ember-data/serializer/rest';

export default class ApplicationSerializer extends RESTSerializer {
  normalizeResponse(_store, primaryModelClass, payload) {
    if (primaryModelClass.modelName === 'repository') {
      const normalizedPayload = payload.map((repo) => ({
        id: String(repo.id),
        type: 'repository',
        attributes: {
          name: repo.name,
          html_url: repo.html_url,
          language: repo.language,
          private: repo.private,
          description: repo.description,
          owner: repo.owner.login,
        },
      }));

      return {
        data: normalizedPayload,
      };
    } else if (primaryModelClass.modelName === 'branch-count') {
      return {
        data: {
          id: '1',
          type: 'branch-count',
          attributes: {
            branchCount: payload.data,
          },
        },
      };
    } else {
      return super.normalizeResponse(...arguments);
    }
  }
}
