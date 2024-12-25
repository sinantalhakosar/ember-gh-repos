import { setupTest } from 'ember-gh-repos/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Serializer | repository', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('repository');
    assert.ok(serializer, 'serializer exists');
  });

  test('it serializes records', function (assert) {
    const store = this.owner.lookup('service:store');
    const record = store.createRecord('repository', {
      name: 'test-repo',
      html_url: 'https://github.com/test/test-repo',
      language: 'JavaScript',
      private: false,
    });

    const serializedRecord = record.serialize();
    assert.ok(serializedRecord, 'record serializes');
    assert.strictEqual(
      serializedRecord.name,
      'test-repo',
      'name is serialized correctly',
    );
    assert.strictEqual(
      serializedRecord.html_url,
      'https://github.com/test/test-repo',
      'html_url is serialized correctly',
    );
    assert.strictEqual(
      serializedRecord.language,
      'JavaScript',
      'language is serialized correctly',
    );
    assert.false(
      serializedRecord.private,
      'private flag is serialized correctly',
    );
  });

  test('it normalizes the response', function (assert) {
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('repository');
    const payload = {
      name: 'test-repo',
      html_url: 'https://github.com/test/test-repo',
      language: 'JavaScript',
      private: false,
    };

    const normalized = serializer.normalize(
      store.modelFor('repository'),
      payload,
    );
    assert.ok(normalized, 'response is normalized');
    assert.strictEqual(
      normalized.data.attributes.name,
      'test-repo',
      'name is normalized correctly',
    );
    assert.strictEqual(
      normalized.data.attributes.html_url,
      'https://github.com/test/test-repo',
      'html_url is normalized correctly',
    );
    assert.strictEqual(
      normalized.data.attributes.language,
      'JavaScript',
      'language is normalized correctly',
    );
    assert.false(
      normalized.data.attributes.private,
      'private flag is normalized correctly',
    );
  });
});
