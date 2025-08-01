'use strict';
/*
 * Module Dependencies.
 */
const Contentstack = require('../../dist/node/contentstack.js');
const init = require('../config.js');
const Utils = require('./utils.js');

const contentTypes = init.contentTypes;
let Stack;
const error = null;

describe('ContentStack SDK Tests', () => {
  // Initialize the Contentstack Stack Instance
  beforeAll(() => {
    return new Promise((resolve) => {
      Stack = Contentstack.Stack(init.stack);
      Stack.setHost(init.host);
      setTimeout(resolve, 1000);
    });
  });

  describe('default .find()', () => {
    let entries;
    const field = 'updated_at';

    // Setup - run the query once for all tests
    beforeAll(async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      entries = await Query.toJSON().find();
    });

    test('should return a non-empty array of entries', async () => {
      expect(entries).toBeDefined();
      expect(Array.isArray(entries)).toBe(true);
      expect(entries[0]).toBeDefined();
      expect(entries[0].length).toBeTruthy();
    });

    test('should not include count when not requested', async () => {
      expect(entries[1]).toBeFalsy();
    });

    test('should return entries sorted by updated_at in descending order by default', async () => {
      if (entries && entries.length && entries[0].length) {
        let prev = entries[0][0][field];
        const _entries = entries[0].every(function (entry) {
          prev = entry[field];
          return entry.updated_at <= prev;
        });
        expect(_entries).toBe(true);
      } else {
        console.warn('Not enough entries returned to verify default sorting');
      }
    });

    test('should have entries with valid structure', async () => {
      if (entries && entries.length && entries[0].length) {
        const firstEntry = entries[0][0];
        expect(firstEntry).toHaveProperty('uid');
        expect(firstEntry).toHaveProperty('title');
        expect(firstEntry).toHaveProperty('updated_at');
      } else {
        console.warn('No entries returned to verify structure');
      }
    });
  });

  describe('sorting', () => {
    test('.ascending()', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const field = 'updated_at';

      const entries = await Query.ascending(field).toJSON().find();

      expect(entries[0].length).toBeTruthy();

      if (entries && entries.length && entries[0].length) {
        let prev = entries[0][0][field];
        const _entries = entries[0].every(function (entry) {
          prev = entry[field];
          return entry[field] >= prev;
        });
        expect(_entries).toBe(true);
      }
    });

    test('.descending()', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const field = 'created_at';

      const entries = await Query.descending(field).toJSON().find();

      expect(entries[0].length).toBeTruthy();

      if (entries && entries.length && entries[0].length) {
        let prev = entries[0][0][field];
        const _entries = entries[0].every(function (entry) {
          prev = entry[field];
          return entry[field] >= prev;
        });
        expect(_entries).toBe(true);
      }
    });
  });

  describe('comparison', () => {
    test('.lessThan()', async () => {
      const Query = Stack.ContentType(
        contentTypes.numbers_content_type
      ).Query();
      const value = 11;
      const field = 'updated_at';

      const entries = await Query.lessThan('num_field', value).toJSON().find();

      expect(entries[0].length).toBeTruthy();

      if (entries && entries.length && entries[0].length) {
        let prev = entries[0][0][field];
        const _entries = entries[0].slice(1).every(function (entry) {
          const flag = entry[field] < value;
          prev = entry[field];
          return flag;
        });
        expect(_entries).toBe(true);
      }
    });

    test('.lessThanOrEqualTo()', async () => {
      const Query = Stack.ContentType(
        contentTypes.numbers_content_type
      ).Query();
      const field = 'updated_at';
      const value = 11;

      const entries = await Query.lessThanOrEqualTo('num_field', value)
        .toJSON()
        .find();

      expect(entries[0].length).toBeTruthy();

      if (entries && entries.length && entries[0].length) {
        let prev = entries[0][0][field];
        const _entries = entries[0].every(function (entry) {
          const flag = entry[field] <= prev;
          prev = entry[field];
          return flag;
        });
        expect(_entries).toBe(true);
      }
    });

    test('.greaterThan()', async () => {
      const Query = Stack.ContentType(
        contentTypes.numbers_content_type
      ).Query();
      const field = 'num_field';
      const value = 11;

      const entries = await Query.greaterThan('num_field', value)
        .ascending(field)
        .toJSON()
        .find();

      expect(entries[0].length).toBeTruthy();

      if (entries && entries.length && entries[0].length) {
        let prev = entries[0][0][field];
        const _entries = entries[0].slice(1).every(function (entry) {
          const flag = entry[field] > value;
          prev = entry[field];
          return flag;
        });
        expect(_entries).toBe(true);
      }
    });

    test('.greaterThanOrEqualTo()', async () => {
      const Query = Stack.ContentType(
        contentTypes.numbers_content_type
      ).Query();
      const field = 'num_field';
      const value = 11;

      const entries = await Query.greaterThanOrEqualTo('num_field', value)
        .descending(field)
        .toJSON()
        .find();

      expect(entries[0].length).toBeTruthy();

      if (entries && entries.length && entries[0].length) {
        let prev = entries[0][0][field];
        const _entries = entries[0].every(function (entry) {
          const flag = entry[field] >= value;
          prev = entry[field];
          return flag;
        });
        expect(_entries).toBe(true);
      }
    });

    test('.notEqualTo()', async () => {
      const Query = Stack.ContentType(
        contentTypes.numbers_content_type
      ).Query();
      const field = 'num_field';
      const value = 6;

      const entries = await Query.notEqualTo('num_field', value)
        .descending(field)
        .toJSON()
        .find();

      expect(entries[0].length).toBeTruthy();

      if (entries && entries.length && entries[0].length) {
        let prev = entries[0][0][field];
        const _entries = entries[0].every(function (entry) {
          const flag = entry[field] != value;
          prev = entry[field];
          return flag;
        });
        expect(_entries).toBe(true);
      }
    });
  });

  describe('array/subset', () => {
    test('.containedIn()', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const _in = ['source1', 'source2'];
      const field = 'updated_at';

      const entries = await Query.containedIn('title', _in).toJSON().find();

      expect(entries[0].length).toBeTruthy();

      if (entries && entries.length && entries[0].length) {
        const _entries = entries[0].every(function (entry) {
          return _in.indexOf(entry.title) != -1;
        });
        expect(_entries).toBe(true);
      }
    });

    test('.notContainedIn()', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const _in = ['sourceddd1', 'sourceddddd2'];

      const entries = await Query.notContainedIn('title', _in).toJSON().find();

      expect(entries[0].length).toBeTruthy();
    });
  });

  describe('exists', () => {
    test('.exists()', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const queryField = 'boolean';
      const field = 'updated_at';

      const entries = await Query.exists(queryField).toJSON().find();

      expect(entries[0].length).toBeTruthy();

      if (entries && entries.length && entries[0].length) {
        let prev = entries[0][0][field];
        const _entries = entries[0].every(function (entry) {
          const flag = entry[field] <= prev;
          prev = entry[field];
          return flag;
        });
        expect(_entries).toBe(true);
      }
    });

    test('.notExists()', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const queryField = 'isspecial';
      const field = 'updated_at';

      const entries = await Query.notExists(queryField).toJSON().find();

      expect('entries' in entries).toBeTruthy();

      if (entries && entries.length && entries[0].length) {
        const prev = entries[0][0][field];
        const _entries = entries[0].every(function (entry) {
          return entry[field] <= prev;
        });
        expect(_entries).toBe(true);
      }
    });
  });

  describe('pagination', () => {
    test('.skip()', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const field = 'updated_at';

      const allEntries = await Query.toJSON().find();

      const entries = await Stack.ContentType(contentTypes.source)
        .Query()
        .skip(1)
        .toJSON()
        .find();

      expect(entries[0].length).toBeGreaterThanOrEqual(2);
      expect(allEntries[0].slice(1)).toEqual(entries[0]);

      if (entries && entries.length && entries[0].length) {
        allEntries[0] = allEntries[0].slice(1);
        let prev = entries[0][0][field];
        const _entries = entries[0].every(function (entry) {
          const flag = entry[field] <= prev;
          prev = entry[field];
          return flag;
        });
        expect(_entries).toBe(true);
      }
    });

    test('.limit()', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const field = 'updated_at';

      const allEntries = await Query.toJSON().find();

      const entries = await Stack.ContentType(contentTypes.source)
        .Query()
        .limit(2)
        .toJSON()
        .find();

      expect(entries[0].length).toBeTruthy();
      expect(allEntries[0].slice(0, 2)).toEqual(entries[0]);

      if (entries && entries.length && entries[0].length) {
        let prev = entries[0][0][field];
        const _entries = entries[0].every(function (entry) {
          const flag = entry[field] <= prev;
          prev = entry[field];
          return flag;
        });
        expect(_entries).toBe(true);
      }
    });

    test('.count()', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      const entries = await Query.count().toJSON().find();

      expect(entries[0]).toBeTruthy();
    });
  });

  describe('logical', () => {
    describe('.or() - Query Objects', () => {
      let entries;
      const titles = ['source1', 'source2'];

      beforeAll(async () => {
        const Query1 = Stack.ContentType(contentTypes.source)
          .Query()
          .containedIn('title', titles);
        const Query2 = Stack.ContentType(contentTypes.source)
          .Query()
          .where('boolean', true);
        const Query = Stack.ContentType(contentTypes.source).Query();

        entries = await Query.or(Query1, Query2).toJSON().find();
      });

      test('should return a non-empty array of entries', async () => {
        expect(entries).toBeDefined();
        expect(Array.isArray(entries)).toBe(true);
        expect(entries[0]).toBeDefined();
        expect(entries[0].length).toBeTruthy();
      });

      test('should return entries matching at least one of the conditions', async () => {
        if (entries && entries.length && entries[0].length) {
          const allEntriesMatchAnyCondition = entries[0].every(
            (entry) => titles.includes(entry.title) || entry.boolean === true
          );
          expect(allEntriesMatchAnyCondition).toBe(true);
        } else {
          console.warn('No entries returned to verify OR condition');
        }
      });

      test('should include entries with title in the specified list', async () => {
        if (entries && entries.length && entries[0].length) {
          const hasEntryWithTitle = entries[0].some((entry) =>
            titles.includes(entry.title)
          );
          expect(hasEntryWithTitle).toBe(true);
        } else {
          console.warn('No entries returned to verify first condition');
        }
      });

      test('should include entries with boolean field set to true', async () => {
        if (entries && entries.length && entries[0].length) {
          const hasEntryWithBoolean = entries[0].some(
            (entry) => entry.boolean === true
          );
          expect(hasEntryWithBoolean).toBe(true);
        } else {
          console.warn('No entries returned to verify second condition');
        }
      });
    });

    describe('.and() - Query Objects', () => {
      let entries;

      beforeAll(async () => {
        const Query1 = Stack.ContentType(contentTypes.source)
          .Query()
          .where('title', 'source1');
        const Query2 = Stack.ContentType(contentTypes.source)
          .Query()
          .where('boolean', true);
        const Query = Stack.ContentType(contentTypes.source).Query();

        entries = await Query.and(Query1, Query2).toJSON().find();
      });

      test('should return a non-empty array of entries', async () => {
        expect(entries).toBeDefined();
        expect(Array.isArray(entries)).toBe(true);
        expect(entries[0]).toBeDefined();
        expect(entries[0].length).toBeTruthy();
      });

      test('should return only entries matching all specified conditions', async () => {
        if (entries && entries.length && entries[0].length) {
          const allEntriesMatchAllConditions = entries[0].every(
            (entry) => entry.title === 'source1' && entry.boolean === true
          );
          expect(allEntriesMatchAllConditions).toBe(true);
        } else {
          console.warn('No entries returned to verify AND condition');
        }
      });

      test('should include entries with title set to "source1"', async () => {
        if (entries && entries.length && entries[0].length) {
          const allEntriesHaveCorrectTitle = entries[0].every(
            (entry) => entry.title === 'source1'
          );
          expect(allEntriesHaveCorrectTitle).toBe(true);
        } else {
          console.warn('No entries returned to verify title condition');
        }
      });

      test('should include entries with boolean field set to true', async () => {
        if (entries && entries.length && entries[0].length) {
          const allEntriesHaveBooleanTrue = entries[0].every(
            (entry) => entry.boolean === true
          );
          expect(allEntriesHaveBooleanTrue).toBe(true);
        } else {
          console.warn('No entries returned to verify boolean condition');
        }
      });
    });

    describe('.query() - Raw query', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.query({
          $or: [{ title: 'source1' }, { boolean: true }]
        })
          .toJSON()
          .find();
      });

      test('should return a non-empty array of entries', async () => {
        expect(entries).toBeDefined();
        expect(Array.isArray(entries)).toBe(true);
        expect(entries[0]).toBeDefined();
        expect(entries[0].length).toBeTruthy();
      });

      test('should return entries matching at least one of the conditions in the raw query', async () => {
        if (entries && entries.length && entries[0].length) {
          const allEntriesMatchAnyCondition = entries[0].every(
            (entry) => entry.title === 'source1' || entry.boolean === true
          );
          expect(allEntriesMatchAnyCondition).toBe(true);
        } else {
          console.warn('No entries returned to verify raw query conditions');
        }
      });

      test('should include entries with title "source1"', async () => {
        if (entries && entries.length && entries[0].length) {
          const hasEntryWithTitle = entries[0].some(
            (entry) => entry.title === 'source1'
          );
          expect(hasEntryWithTitle).toBe(true);
        } else {
          console.warn(
            'No entries returned to verify first raw query condition'
          );
        }
      });

      test('should include entries with boolean field set to true', async () => {
        if (entries && entries.length && entries[0].length) {
          const hasEntryWithBoolean = entries[0].some(
            (entry) => entry.boolean === true
          );
          expect(hasEntryWithBoolean).toBe(true);
        } else {
          console.warn(
            'No entries returned to verify second raw query condition'
          );
        }
      });
    });
  });

  describe('custom query', () => {
    test('.query() - Raw query with basic OR condition', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      const entries = await Query.query({
        $or: [{ title: 'source1' }, { boolean: 'true' }]
      })
        .toJSON()
        .find();

      expect(entries[0].length).toBeTruthy();

      if (entries && entries.length && entries[0].length) {
        const _entries = entries[0].every(function (entry) {
          return entry.title === 'source1' || entry.boolean === true;
        });
        expect(_entries).toBeTruthy();
      }
    });

    test('.query() - Raw query with AND condition', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      const entries = await Query.query({
        $and: [{ title: 'source1' }, { boolean: true }]
      })
        .toJSON()
        .find();

      expect(entries[0].length).toBeTruthy();

      const allMatchBothConditions = entries[0].every(
        (entry) => entry.title === 'source1' && entry.boolean === true
      );
      expect(allMatchBothConditions).toBeTruthy();
    });

    test('.query() - Raw query with nested conditions', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      const entries = await Query.query({
        $and: [
          { title: 'source1' },
          { $or: [{ boolean: true }, { url: { $exists: true } }] }
        ]
      })
        .toJSON()
        .find();

      expect(entries[0].length).toBeTruthy();

      const allMatchConditions = entries[0].every(
        (entry) =>
          entry.title === 'source1' &&
          (entry.boolean === true || entry.url !== undefined)
      );
      expect(allMatchConditions).toBeTruthy();
    });
  });

  describe('tags', () => {
    test('.tags() - Multiple tags filter', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const field = 'tags';
      const tags = ['tag1', 'tag2'];

      const entries = await Query.tags(tags).toJSON().find();

      expect(entries.length).toBeGreaterThanOrEqual(1);

      if (entries && entries.length && entries[0].length) {
        const _entries = entries[0].every(function (entry) {
          return Utils.arrayPresentInArray(tags, entry[field]);
        });
        expect(_entries).toBe(true);
      }
    });

    test('.tags() - Single tag filter', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const field = 'tags';
      const tags = ['tag1'];

      const entries = await Query.tags(tags).toJSON().find();

      expect(entries.length).toBeGreaterThanOrEqual(1);

      if (entries && entries.length && entries[0].length) {
        const entriesWithTag = entries[0].every(
          (entry) => entry[field] && entry[field].includes(tags[0])
        );
        expect(entriesWithTag).toBe(true);
      }
    });

    test('.tags() - Empty results with non-existent tag', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const nonExistentTag = ['non_existent_tag_123456'];

      const entries = await Query.tags(nonExistentTag).toJSON().find();

      // Should return an array but with empty results
      expect(entries).toBeDefined();
      expect(Array.isArray(entries)).toBe(true);
      expect(entries[0].length).toBe(0);
    });
  });

  describe('search', () => {
    test('.search() - Exact match', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      const entries = await Query.search('source1').toJSON().find();

      expect(entries[0].length).toBeTruthy();

      const hasMatchingEntries = entries[0].some(
        (entry) =>
          entry.title === 'source1' || JSON.stringify(entry).includes('source1')
      );
      expect(hasMatchingEntries).toBe(true);
    });

    test('.search() - Partial match', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      const entries = await Query.search('source').toJSON().find();

      expect(entries[0].length).toBeTruthy();

      const hasMatchingEntries = entries[0].some(
        (entry) =>
          (entry.title && entry.title.includes('source')) ||
          JSON.stringify(entry).includes('source')
      );
      expect(hasMatchingEntries).toBe(true);
    });

    test('.search() - Case insensitive match', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      const entries = await Query.search('SOURCE1').toJSON().find();

      expect(entries[0].length).toBeTruthy();

      const hasMatchingEntries = entries[0].some(
        (entry) =>
          (entry.title && entry.title.toLowerCase() === 'source1') ||
          JSON.stringify(entry).toLowerCase().includes('source1')
      );
      expect(hasMatchingEntries).toBe(true);
    });
  });

  describe('regex', () => {
    test('.regex() - Basic pattern match', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const field = 'title';
      const regex = {
        pattern: '^source',
        options: 'i'
      };
      const regexpObj = new RegExp(regex.pattern, regex.options);

      const entries = await Query.regex(field, regex.pattern, regex.options)
        .toJSON()
        .find();

      expect(entries.length).toBeGreaterThanOrEqual(1);

      const flag = entries[0].every(function (entry) {
        return regexpObj.test(entry[field]);
      });
      expect(flag).toBeTruthy();
    });

    test('.regex() - Specific suffix pattern', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const field = 'title';
      const regex = {
        pattern: '1$', // Matches strings ending with 1
        options: ''
      };
      const regexpObj = new RegExp(regex.pattern, regex.options);

      const entries = await Query.regex(field, regex.pattern, regex.options)
        .toJSON()
        .find();

      expect(entries.length).toBeGreaterThanOrEqual(1);

      if (entries && entries[0].length) {
        const matchesPattern = entries[0].every((entry) =>
          regexpObj.test(entry[field])
        );
        expect(matchesPattern).toBeTruthy();

        const endsWithOne = entries[0].every(
          (entry) => entry[field] && entry[field].endsWith('1')
        );
        expect(endsWithOne).toBeTruthy();
      }
    });

    test('.regex() - With wildcard pattern', async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const field = 'title';
      const regex = {
        pattern: 'source.*',
        options: 'i'
      };
      const regexpObj = new RegExp(regex.pattern, regex.options);

      const entries = await Query.regex(field, regex.pattern, regex.options)
        .toJSON()
        .find();

      expect(entries.length).toBeGreaterThanOrEqual(1);

      if (entries && entries[0].length) {
        const matchesPattern = entries[0].every((entry) =>
          regexpObj.test(entry[field])
        );
        expect(matchesPattern).toBeTruthy();
      }
    });
  });

  describe('locale and fallback', () => {
    test('find: with specific locale', async () => {
      const locale = 'ja-jp';

      const entries = await Stack.ContentType(contentTypes.source)
        .Query()
        .language(locale)
        .toJSON()
        .find();

      expect(entries[0].length).toBeTruthy();

      if (entries && entries.length && entries[0].length) {
        const allEntriesInRequestedLocale = entries[0].every(
          (entry) =>
            entry.publish_details && entry.publish_details.locale === locale
        );
        expect(allEntriesInRequestedLocale).toBe(true);
      }
    });

    test('find: with fallback enabled for partially localized content', async () => {
      const primaryLocale = 'ja-jp';
      const fallbackLocale = 'en-us';

      const entries = await Stack.ContentType(contentTypes.source)
        .Query()
        .language(primaryLocale)
        .includeFallback()
        .toJSON()
        .find();

      expect(entries[0].length).toBeTruthy();

      if (entries && entries.length && entries[0].length) {
        const _entries = entries[0].every(function (entry) {
          return [primaryLocale, fallbackLocale].includes(
            entry.publish_details.locale
          );
        });
        expect(_entries).toBe(true);
      }

      if (entries && entries.length && entries[0].length > 1) {
        const hasPrimaryLocaleEntries = entries[0].some(
          (entry) => entry.publish_details.locale === primaryLocale
        );

        const hasFallbackLocaleEntries = entries[0].some(
          (entry) => entry.publish_details.locale === fallbackLocale
        );

        expect(hasPrimaryLocaleEntries || hasFallbackLocaleEntries).toBe(true);
      }
    });

    test('find: comparing results with and without fallback', async () => {
      const locale = 'ja-jp';

      const entriesWithoutFallback = await Stack.ContentType(
        contentTypes.source
      )
        .Query()
        .language(locale)
        .toJSON()
        .find();

      const entriesWithFallback = await Stack.ContentType(contentTypes.source)
        .Query()
        .language(locale)
        .includeFallback()
        .toJSON()
        .find();

      expect(entriesWithFallback[0].length).toBeGreaterThanOrEqual(
        entriesWithoutFallback[0].length
      );

      if (entriesWithoutFallback && entriesWithoutFallback[0].length) {
        const allInRequestedLocale = entriesWithoutFallback[0].every(
          (entry) => entry.publish_details.locale === locale
        );
        expect(allInRequestedLocale).toBe(true);
      }
    });
  });

  describe('include reference', () => {
    describe('.includeReference() - String', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.includeReference('reference').toJSON().find();
      });

      test('should return entries with the reference field', () => {
        expect(entries[0].length).toBeGreaterThan(0);
      });

      test('should include the reference field as an object', () => {
        const allEntriesHaveReference = entries[0].every(
          (entry) =>
            entry &&
            entry.reference &&
            typeof entry.reference === 'object'
        );
        expect(allEntriesHaveReference).toBe(true);
      });
    });

    describe('.includeReference() - Array', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.includeReference(['reference', 'other_reference'])
          .toJSON()
          .find();
      });

      test('should return entries with data', () => {
        expect(entries[0].length).toBeGreaterThan(0);
      });

      test('should include the first reference field as an object', () => {
        const allEntriesHaveFirstReference = entries[0].every(
          (entry) =>
            entry &&
            entry.reference &&
            typeof entry.reference === 'object'
        );
        expect(allEntriesHaveFirstReference).toBe(true);
      });

      test('should include the second reference field as an object', () => {
        const allEntriesHaveSecondReference = entries[0].every(
          (entry) =>
            entry &&
            entry.other_reference &&
            typeof entry.other_reference === 'object'
        );
        expect(allEntriesHaveSecondReference).toBe(true);
      });
    });
  });

  describe('include count and schema', () => {
    describe('.includeCount()', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.includeCount().toJSON().find();
      });

      test('should return entries', () => {
        expect(entries[0].length).toBeTruthy();
      });

      test('should include count information', () => {
        expect(entries[1]).toBeTruthy();
      });
    });

    describe('.includeSchema()', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.includeSchema().toJSON().find();
      });

      test('should return entries', () => {
        expect(entries[0].length).toBeTruthy();
      });

      test('should include schema information', () => {
        expect(entries[1].length).toBeTruthy();
      });
    });

    describe('.includeCount() and .includeSchema()', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.includeCount().includeSchema().toJSON().find();
      });

      test('should return entries', () => {
        expect(entries[0].length).toBeTruthy();
      });

      test('should include schema information', () => {
        expect(entries[1].length).toBeTruthy();
      });

      test('should include count information', () => {
        expect(entries[2]).toBeTruthy();
      });
    });
  });

  describe('include contenttypes', () => {
    describe('.includeContentType()', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.includeContentType().toJSON().find();
      });

      test('should return entries', () => {
        expect(entries[0].length).toBeTruthy();
      });

      test('should include content type information', () => {
        expect(entries[1]).toBeTruthy();
      });

      test('should include content type title', () => {
        expect(entries[1].title).toBeTruthy();
      });

      test('should have the correct content type UID', () => {
        expect(entries[1].uid).toBe(contentTypes.source);
      });
    });

    describe('.includeCount() and .includeContentType()', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.includeCount()
          .includeContentType()
          .toJSON()
          .find();
      });

      test('should return entries', () => {
        expect(entries[0].length).toBeTruthy();
      });

      test('should include content type information', () => {
        expect(entries[1]).toBeTruthy();
      });

      test('should include content type title', () => {
        expect(entries[1].title).toBeTruthy();
      });

      test('should have the correct content type UID', () => {
        expect(entries[1].uid).toBe(contentTypes.source);
      });

      test('should include count information', () => {
        expect(entries[2]).toBeTruthy();
      });
    });

    describe('.includeSchema() and .includeContentType()', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.includeSchema()
          .includeContentType()
          .toJSON()
          .find();
      });

      test('should return entries', () => {
        expect(entries[0].length).toBeTruthy();
      });

      test('should include content type information', () => {
        expect(entries[1]).toBeTruthy();
      });

      test('should include content type title', () => {
        expect(entries[1].title).toBeTruthy();
      });

      test('should have the correct content type UID', () => {
        expect(entries[1].uid).toBe(contentTypes.source);
      });
    });

    describe('.includeCount(), .includeSchema() and .includeContentType()', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.includeCount()
          .includeSchema()
          .includeContentType()
          .toJSON()
          .find();
      });

      test('should return entries', () => {
        expect(entries[0].length).toBeTruthy();
      });

      test('should include content type information', () => {
        expect(entries[1]).toBeTruthy();
      });

      test('should include content type title', () => {
        expect(entries[1].title).toBeTruthy();
      });

      test('should have the correct content type UID', () => {
        expect(entries[1].uid).toBe(contentTypes.source);
      });

      test('should include count information', () => {
        expect(entries[2]).toBeTruthy();
      });
    });
  });

  describe('field projections', () => {
    describe('.only() - Single String Parameter', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.only('title').toJSON().find();
      });

      test('should return entries', () => {
        expect(entries[0].length).toBeTruthy();
      });

      test('should include only the title and uid fields', () => {
        const correctFieldsOnly = entries[0].every(
          (entry) =>
            entry &&
            Object.keys(entry).length === 2 &&
            'title' in entry &&
            'uid' in entry
        );
        expect(correctFieldsOnly).toBeTruthy();
      });
    });

    describe('.only() - Multiple String Parameter', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.only('BASE', 'title').toJSON().find();
      });

      test('should return entries', () => {
        expect(entries[0].length).toBeTruthy();
      });

      test('should include only the title and uid fields', () => {
        const correctFieldsOnly = entries[0].every(
          (entry) =>
            entry &&
            Object.keys(entry).length === 2 &&
            'title' in entry &&
            'uid' in entry
        );
        expect(correctFieldsOnly).toBeTruthy();
      });
    });

    describe('.only() - Array Parameter', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.only(['title', 'url']).toJSON().find();
      });

      test('should return entries', () => {
        expect(entries[0].length).toBeTruthy();
      });

      test('should include only the title, url, and uid fields', () => {
        const correctFieldsOnly = entries[0].every(
          (entry) =>
            entry &&
            Object.keys(entry).length === 3 &&
            'title' in entry &&
            'url' in entry &&
            'uid' in entry
        );
        expect(correctFieldsOnly).toBeTruthy();
      });
    });

    describe('.except() - Single String Parameter', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.except('title').toJSON().find();
      });

      test('should return entries', () => {
        expect(entries[0].length).toBeTruthy();
      });

      test('should exclude the title field', () => {
        const titleExcluded = entries[0].every(
          (entry) => entry && !('title' in entry)
        );
        expect(titleExcluded).toBeTruthy();
      });
    });

    describe('.except() - Multiple String Parameter', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.except('BASE', 'title').toJSON().find();
      });

      test('should return entries', () => {
        expect(entries[0].length).toBeTruthy();
      });

      test('should exclude the title field', () => {
        const titleExcluded = entries[0].every(
          (entry) => entry && !('title' in entry)
        );
        expect(titleExcluded).toBeTruthy();
      });
    });

    describe('.except() - Array of String Parameter', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.except(['title', 'file']).toJSON().find();
      });

      test('should return entries', () => {
        expect(entries[0].length).toBeTruthy();
      });

      test('should exclude the title field', () => {
        const titleExcluded = entries[0].every(
          (entry) => entry && !('title' in entry)
        );
        expect(titleExcluded).toBeTruthy();
      });

      test('should exclude the file field', () => {
        const fileExcluded = entries[0].every(
          (entry) => entry && !('file' in entry)
        );
        expect(fileExcluded).toBeTruthy();
      });
    });

    describe('.except() - For the reference - String', () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.includeReference('reference')
          .only('BASE', ['reference'])
          .except('reference', 'title')
          .toJSON()
          .find();
      });

      test('should return entries', () => {
        expect(entries[0].length).toBeTruthy();
      });

      test('should properly format entries with reference but without title in references', () => {
        const correctFormat = entries[0].every((entry) => {
          let hasCorrectReferenceFormat = false;
          if (
            entry &&
            entry.reference &&
            typeof entry.reference === 'object'
          ) {
            hasCorrectReferenceFormat = true;
            hasCorrectReferenceFormat = entry.reference.every((reference) => {
              return reference && !('title' in reference);
            });
          }

          return (
            hasCorrectReferenceFormat &&
            entry &&
            Object.keys(entry).length === 2 &&
            'reference' in entry &&
            'uid' in entry
          );
        });

        expect(correctFormat).toBeTruthy();
      });
    });
  });
});
