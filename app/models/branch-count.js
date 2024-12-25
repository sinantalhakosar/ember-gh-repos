import Model, { attr } from '@ember-data/model';

export default class BranchCountModel extends Model {
  @attr('number') branchCount;
}
