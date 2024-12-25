import Model, { attr } from '@ember-data/model';

export default class RepositoryModel extends Model {
  @attr('string') name;
  @attr('string') html_url;
  @attr('string') language;
  @attr('boolean') private;
  @attr('number') forks_count;
  @attr('string') description;
}
