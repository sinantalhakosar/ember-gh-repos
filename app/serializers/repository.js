import RESTSerializer from '@ember-data/serializer/rest';

export default class RepositorySerializer extends RESTSerializer {
  normalizeResponse(_store, _primaryModelClass, payload) {
    const normalizedPayload = payload.map((repo) => ({
      id: String(repo.id),
      type: 'repository',
      attributes: {
        name: repo.name,
        html_url: repo.html_url,
        language: repo.language,
        private: repo.private,
        description: repo.description,
      },
    }));

    return {
      data: normalizedPayload,
    };
  }
}
