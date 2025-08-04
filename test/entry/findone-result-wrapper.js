'use strict';
/*
 * Module Dependencies.
 */
const Contentstack = require('../../dist/node/contentstack.js');
const Utils = require('./utils.js');
const init = require('../config.js');

const contentTypes = init.contentTypes;

let Stack;

describe('FindOne Tests', () => {
  // Setup - Initialize the Contentstack Stack Instance
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('Default FindOne', () => {
    let entry;

    beforeAll(async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      entry = await Query.toJSON().findOne();
    });

    test('Should return an entry with uid, locale, publish_details', () => {
      expect(entry).toBeDefined();
      expect(entry.uid).toBeDefined();
      expect(entry.locale).toBeDefined();
      expect(entry.publish_details).toBeDefined();
    });
  });

  // SORTING TESTS
  describe('Sorting', () => {
    describe('Ascending', () => {
      let entry;
      const field = 'updated_at';

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.ascending(field).toJSON().findOne();
      });

      test('Should return an entry with uid, locale, publish_details', () => {
        expect(entry).toBeDefined();
        expect(entry.uid).toBeDefined();
        expect(entry.locale).toBeDefined();
        expect(entry.publish_details).toBeDefined();
      });
    });

    describe('Descending', () => {
      let entry;
      const field = 'created_at';

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.descending(field).toJSON().findOne();
      });

      test('Should return an entry with uid, locale, publish_details', () => {
        expect(entry).toBeDefined();
        expect(entry.uid).toBeDefined();
        expect(entry.locale).toBeDefined();
        expect(entry.publish_details).toBeDefined();
      });
    });
  });

  // COMPARISON TESTS
  describe('Comparison', () => {
    describe('lessThan', () => {
      let entry;
      const field = 'num_field';
      const value = 11;

      beforeAll(async () => {
        const Query = Stack.ContentType(
          contentTypes.numbers_content_type
        ).Query();
        entry = await Query.lessThan(field, value).toJSON().findOne();
      });

      test('Should return an entry with uid, locale, publish_details', () => {
        expect(entry).toBeDefined();
        expect(entry.uid).toBeDefined();
        expect(entry.locale).toBeDefined();
        expect(entry.publish_details).toBeDefined();
      });

      test('num_field should be less than specified value', () => {
        expect(entry[field]).toBeLessThan(value);
      });
    });

    describe('lessThanOrEqualTo', () => {
      let entry;
      const field = 'num_field';
      const value = 11;

      beforeAll(async () => {
        const Query = Stack.ContentType(
          contentTypes.numbers_content_type
        ).Query();
        entry = await Query.lessThanOrEqualTo(field, value).toJSON().findOne();
      });
      test('Should return an entry with uid, locale, publish_details', () => {
        expect(entry).toBeDefined();
        expect(entry.uid).toBeDefined();
        expect(entry.locale).toBeDefined();
        expect(entry.publish_details).toBeDefined();
      });
      test('num_field should be less than or equal to specified value', () => {
        expect(entry[field]).toBeLessThanOrEqual(value);
      });
    });

    describe('greaterThan', () => {
      let entry;
      const field = 'num_field';
      const value = 6;

      beforeAll(async () => {
        const Query = Stack.ContentType(
          contentTypes.numbers_content_type
        ).Query();
        entry = await Query.greaterThan(field, value)
          .ascending(field)
          .toJSON()
          .findOne();
      });

      test('Should return an entry with uid, locale, publish_details', () => {
        expect(entry).toBeDefined();
        expect(entry.uid).toBeDefined();
        expect(entry.locale).toBeDefined();
        expect(entry.publish_details).toBeDefined();
      });

      test('num_field should be greater than specified value', () => {
        expect(entry[field]).toBeGreaterThan(value);
      });
    });

    describe('greaterThanOrEqualTo', () => {
      let entry;
      const field = 'num_field';
      const value = 11;

      beforeAll(async () => {
        const Query = Stack.ContentType(
          contentTypes.numbers_content_type
        ).Query();
        entry = await Query.greaterThanOrEqualTo(field, value)
          .descending(field)
          .toJSON()
          .findOne();
      });

      test('Should return an entry with uid, locale, publish_details', () => {
        expect(entry).toBeDefined();
        expect(entry.uid).toBeDefined();
        expect(entry.locale).toBeDefined();
        expect(entry.publish_details).toBeDefined();
      });

      test('num_field should be greater than or equal to specified value', () => {
        expect(entry[field]).toBeGreaterThanOrEqual(value);
      });
    });

    describe('notEqualTo', () => {
      let entry;
      const field = 'num_field';
      const value = 6;

      beforeAll(async () => {
        const Query = Stack.ContentType(
          contentTypes.numbers_content_type
        ).Query();
        entry = await Query.notEqualTo(field, value)
          .descending(field)
          .toJSON()
          .findOne();
      });

      test('num_field should not be equal to specified value', () => {
        expect(entry[field]).not.toBe(value);
      });

      test('Should return an entry with uid, locale, publish_details', () => {
        expect(entry).toBeDefined();
        expect(entry.uid).toBeDefined();
        expect(entry.locale).toBeDefined();
        expect(entry.publish_details).toBeDefined();
      });
    });
  });

  // ARRAY/SUBSET TESTS
  describe('Array/Subset', () => {
    describe('containedIn', () => {
      let entry;
      const _in = ['source1', 'source2'];

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.containedIn('title', _in).toJSON().findOne();
      });

      test('Entry title should be in the specified values', () => {
        expect(_in).toContain(entry.title);
      });

      test('Should return an entry with uid, locale, publish_details', () => {
        expect(entry).toBeDefined();
        expect(entry.uid).toBeDefined();
        expect(entry.locale).toBeDefined();
        expect(entry.publish_details).toBeDefined();
      });
    });

    describe('notContainedIn', () => {
      let entry;
      const _in = ['source1'];

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.notContainedIn('title', _in).toJSON().findOne();
      });

      test('Should either return an entry with matching criteria or an expected error', () => {
        if (entry) {
          expect(entry.title).toBeDefined();
          expect(_in).not.toContain(entry.title);
        } else {
          expect(error).toEqual({
            error_code: 141,
            error_message: "The requested entry doesn't exist."
          });
        }
      });

      test('If entry exists, it should have uid', () => {
        if (entry) {
          expect(entry.uid).toBeDefined();
        }
      });

      test('If entry exists, it should have locale', () => {
        if (entry) {
          expect(entry.locale).toBeDefined();
        }
      });

      test('If entry exists, it should have publish_details', () => {
        if (entry) {
          expect(entry.publish_details).toBeDefined();
        }
      });
    });
  });

  // ELEMENT EXISTS TESTS
  describe('Element Existence', () => {
    describe('exists', () => {
      let entry;
      const queryField = 'boolean';

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.exists(queryField).toJSON().findOne();
      });

      test('Entry should have the queried field', () => {
        expect(typeof entry[queryField]).not.toBe('undefined');
      });

      test('Should return an entry with uid, locale, publish_details', () => {
        expect(entry).toBeDefined();
        expect(entry.uid).toBeDefined();
        expect(entry.locale).toBeDefined();
        expect(entry.publish_details).toBeDefined();
      });
    });

    describe('notExists', () => {
      let entry;
      const queryField = 'isspecial';

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.notExists(queryField).toJSON().findOne();
      });

      test('Should handle either success or error case', () => {
        if (entry) {
          expect(typeof entry[queryField]).toBe('undefined');
        } else {
          expect(error).toEqual({
            error_code: 141,
            error_message: "The requested entry doesn't exist."
          });
        }
      });

      test('If entry exists, it should have uid', () => {
        if (entry) {
          expect(entry.uid).toBeDefined();
        }
      });

      test('If entry exists, it should have locale', () => {
        if (entry) {
          expect(entry.locale).toBeDefined();
        }
      });

      test('If entry exists, it should have publish_details', () => {
        if (entry) {
          expect(entry.publish_details).toBeDefined();
        }
      });
    });
  });
  describe('Pagination', () => {
    describe('skip', () => {
      let allEntries;
      let skippedEntry;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        allEntries = await Query.toJSON().find();

        const skipQuery = Stack.ContentType(contentTypes.source).Query();
        skippedEntry = await skipQuery.skip(1).toJSON().findOne();
      });

      test('Should have entries in the result set', () => {
        expect(allEntries.length).toBeTruthy();
      });

      test('Should get correct skipped entry', () => {
        expect(skippedEntry).toEqual(allEntries[0][1]);
      });
    });
  });

  describe('Logical Operations', () => {
    describe('OR Query Objects', () => {
      let entry;

      beforeAll(async () => {
        const Query1 = Stack.ContentType(contentTypes.source)
          .Query()
          .containedIn('title', ['source1']);
        const Query2 = Stack.ContentType(contentTypes.source)
          .Query()
          .where('boolean', 'false');
        const Query = Stack.ContentType(contentTypes.source).Query();

        entry = await Query.or(Query1, Query2).toJSON().findOne();
      });

      test('Should return an entry with uid, locale, publish_details', () => {
        expect(entry).toBeDefined();
        expect(entry.uid).toBeDefined();
        expect(entry.locale).toBeDefined();
        expect(entry.publish_details).toBeDefined();
      });
    });

    describe('AND Query Objects', () => {
      let entry;

      beforeAll(async () => {
        const Query1 = Stack.ContentType(contentTypes.source)
          .Query()
          .containedIn('title', ['source1']);
        const Query2 = Stack.ContentType(contentTypes.source)
          .Query()
          .where('boolean', true);
        const Query = Stack.ContentType(contentTypes.source).Query();

        entry = await Query.and(Query1, Query2).toJSON().findOne();
      });

      test('Should return an entry with uid, locale, publish_details', () => {
        expect(entry).toBeDefined();
        expect(entry.uid).toBeDefined();
        expect(entry.locale).toBeDefined();
        expect(entry.publish_details).toBeDefined();
      });
    });

    describe('Raw Query', () => {
      let entry;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.query({
          $or: [{ title: 'source1' }, { boolean: 'false' }]
        })
          .toJSON()
          .findOne();
      });

      test('Entry should satisfy OR condition', () => {
        expect(
          entry.title === 'source1' || entry.boolean === false
        ).toBeTruthy();
      });

      test('Should return an entry with uid, locale, publish_details', () => {
        expect(entry).toBeDefined();
        expect(entry.uid).toBeDefined();
        expect(entry.locale).toBeDefined();
        expect(entry.publish_details).toBeDefined();
      });
    });
  });

  describe('Tags', () => {
    let entry;
    const tags = ['tag1', 'tag2'];

    beforeAll(async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      entry = await Query.tags(tags).toJSON().findOne();
    });

    test('Tags specified should be found in the result', () => {
      expect(Utils.arrayPresentInArray(tags, entry.tags) > 0).toBe(true);
    });

    test('Should return an entry with uid, locale, publish_details', () => {
      expect(entry).toBeDefined();
      expect(entry.uid).toBeDefined();
      expect(entry.locale).toBeDefined();
      expect(entry.publish_details).toBeDefined();
    });
  });

  describe('Search', () => {
    let entry;

    beforeAll(async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      entry = await Query.search('source1').toJSON().findOne();
    });

    test('Should return an entry with uid, locale, publish_details', () => {
      expect(entry).toBeDefined();
      expect(entry.uid).toBeDefined();
      expect(entry.locale).toBeDefined();
      expect(entry.publish_details).toBeDefined();
    });
  });

  describe('Regex', () => {
    let entry;
    const field = 'title';
    const regex = {
      pattern: '^source',
      options: 'i'
    };

    beforeAll(async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      entry = await Query.regex(field, regex.pattern, regex.options)
        .toJSON()
        .findOne();
    });

    test('Entry field should match the regex pattern', () => {
      const regExp = new RegExp(regex.pattern, regex.options);
      expect(regExp.test(entry[field])).toBe(true);
    });

    test('Should return an entry with uid, locale, publish_details', () => {
      expect(entry).toBeDefined();
      expect(entry.uid).toBeDefined();
      expect(entry.locale).toBeDefined();
      expect(entry.publish_details).toBeDefined();
    });
  });

  describe('Localization', () => {
    describe('Without Fallback', () => {
      let entry;
      const _in = ['ja-jp'];

      beforeAll(async () => {
        entry = await Stack.ContentType(contentTypes.source)
          .Query()
          .language('ja-jp')
          .toJSON()
          .findOne();
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should have correct locale in publish_details', () => {
        expect(_in).toContain(entry.publish_details.locale);
      });
    });

    describe('With Fallback', () => {
      let entry;
      const _in = ['ja-jp', 'en-us'];

      beforeAll(async () => {
        entry = await Stack.ContentType(contentTypes.source)
          .Query()
          .language('ja-jp')
          .includeFallback()
          .toJSON()
          .findOne();
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should have locale from allowed fallback list', () => {
        expect(_in).toContain(entry.publish_details.locale);
      });
    });
  });
  describe('Including References', () => {
    describe('includeReference - String', () => {
      let entry;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.includeReference('reference').toJSON().findOne();
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('All present references should be included as objects', () => {
        expect(
          entry && entry.reference && typeof entry.reference === 'object'
        ).toBe(true);
      });
    });

    describe('includeReference - Array', () => {
      let entry;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.includeReference(['reference', 'other_reference'])
          .toJSON()
          .findOne();
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('All present references should be included as objects', () => {
        const condition =
          entry &&
          entry.reference &&
          typeof entry.reference === 'object' &&
          entry.other_reference &&
          typeof entry.other_reference === 'object';
        expect(condition).toBe(true);
      });
    });
  });

  describe('Including Schema', () => {
    let entry;

    beforeAll(async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      entry = await Query.includeSchema().toJSON().findOne();
    });

    test('Should return an entry', () => {
      expect(entry).toBeDefined();
    });
  });

  describe('Including ContentType', () => {
    let entry;
    let contentType;

    beforeAll(async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      [entry, contentType] = await new Promise((resolve, reject) => {
        Query.includeContentType()
          .toJSON()
          .findOne()
          .then((entry, contentType) => resolve([entry, contentType]), reject);
      });
    });

    test('Should return an entry', () => {
      expect(entry).toBeDefined();
    });

    test('ContentType should not be present', () => {
      expect(typeof contentType).toBe('undefined');
    });
  });

  describe('Including Schema and ContentType', () => {
    let entry;
    let contentType;

    beforeAll(async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      [entry, contentType] = await new Promise((resolve, reject) => {
        Query.includeSchema()
          .includeContentType()
          .toJSON()
          .findOne()
          .then((entry, contentType) => resolve([entry, contentType]), reject);
      });
    });

    test('Should return an entry', () => {
      expect(entry).toBeDefined();
    });

    test('ContentType should not be present', () => {
      expect(typeof contentType).toBe('undefined');
    });
  });

  describe('Field Selection - Only', () => {
    describe('only - Single String Parameter', () => {
      let entry;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.only('title').toJSON().findOne();
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should only contain title and uid fields', () => {
        expect(Object.keys(entry).length).toBe(2);
        expect(entry).toHaveProperty('title');
        expect(entry).toHaveProperty('uid');
      });
    });

    describe('only - Multiple String Parameters', () => {
      let entry;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.only('BASE', 'title').toJSON().findOne();
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should only contain title and uid fields', () => {
        expect(Object.keys(entry).length).toBe(2);
        expect(entry).toHaveProperty('title');
        expect(entry).toHaveProperty('uid');
      });
    });

    describe('only - Array Parameter', () => {
      let entry;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.only(['title', 'url']).toJSON().findOne();
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should contain title, url, and uid fields', () => {
        expect(Object.keys(entry).length).toBe(3);
        expect(entry).toHaveProperty('title');
        expect(entry).toHaveProperty('url');
        expect(entry).toHaveProperty('uid');
      });
    });

    describe('only - For reference - String', () => {
      let entry;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.includeReference('reference')
          .only('BASE', 'reference')
          .only('reference', 'title')
          .toJSON()
          .findOne();
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Reference fields should be properly filtered', () => {
        let hasProperReferences = false;
        if (
          entry &&
          entry.reference &&
          typeof entry.reference === 'object'
        ) {
          hasProperReferences = entry.reference.every(
            (ref) => ref && 'title' in ref && 'uid' in ref
          );
        } else {
          hasProperReferences = true; // No references or empty references is valid
        }
        expect(hasProperReferences).toBe(true);
      });
    });

    describe('only - For reference - Array', () => {
      let entry;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.includeReference('reference')
          .only('BASE', ['reference'])
          .only('reference', ['title'])
          .toJSON()
          .findOne();
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('References should have only specified fields', () => {
        let hasProperReferences = false;
        if (entry && entry.reference) {
          if (Array.isArray(entry.reference)) {
            if (entry.reference.length === 0) {
              hasProperReferences = true;
            } else {
              hasProperReferences = entry.reference.every(
                (ref) => ref && 'title' in ref && 'uid' in ref
              );
            }
          } else {
            hasProperReferences = true;
          }
        } else {
          hasProperReferences = true;
        }
        expect(hasProperReferences).toBe(true);
      });
    });
  });

  describe('Field Selection - Except', () => {
    describe('except - Single String Parameter', () => {
      let entry;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.except('title').toJSON().findOne();
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should not contain the excluded field', () => {
        expect(entry).not.toHaveProperty('title');
      });
    });

    describe('except - Multiple String Parameters', () => {
      let entry;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.except('BASE', 'title').toJSON().findOne();
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should not contain the excluded field', () => {
        expect(entry).not.toHaveProperty('title');
      });
    });

    describe('except - Array of String Parameters', () => {
      let entry;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.except(['title', 'url']).toJSON().findOne();
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should not contain the first excluded field', () => {
        expect(entry).not.toHaveProperty('title');
      });

      test('Entry should not contain the second excluded field', () => {
        expect(entry).not.toHaveProperty('url');
      });
    });

    describe('except - For the reference - String', () => {
      let entry;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.includeReference('reference')
          .only('BASE', 'reference')
          .except('reference', 'title')
          .toJSON()
          .findOne();
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('References should not contain the excluded field', () => {
        let hasProperExclusions = false;
        if (
          entry &&
          entry.reference &&
          typeof entry.reference === 'object'
        ) {
          hasProperExclusions = entry.reference.every(
            (ref) => ref && !('title' in ref)
          );
        } else {
          // No references is valid for this test
          hasProperExclusions = true;
        }
        expect(hasProperExclusions).toBe(true);
      });
    });

    describe('except - For the reference - Array', () => {
      let entry;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.includeReference('reference')
          .only('BASE', ['reference'])
          .except('reference', ['title'])
          .toJSON()
          .findOne();
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('References should not contain the excluded field', () => {
        let hasProperExclusions = false;
        if (
          entry &&
          entry.reference &&
          typeof entry.reference === 'object'
        ) {
          hasProperExclusions = entry.reference.every(
            (ref) => ref && !('title' in ref)
          );
        } else {
          hasProperExclusions = true;
        }
        expect(hasProperExclusions).toBe(true);
      });
    });
  });
});
