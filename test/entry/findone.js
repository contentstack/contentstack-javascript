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
    let error = null;

    beforeAll(async () => {
      try {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.toJSON().findOne();
      } catch (err) {
        error = err;
        console.error("Error:", err);
      }
    });

    test('Should return an entry', () => {
      expect(entry).toBeDefined();
    });

    test('Entry should have uid', () => {
      expect(entry.uid).toBeDefined();
    });

    test('Entry should have locale', () => {
      expect(entry.locale).toBeDefined();
    });

    test('Entry should have publish_details', () => {
      expect(entry.publish_details).toBeDefined();
    });
  });

  describe('Sorting', () => {
    describe('Ascending', () => {
      let entry;
      let error = null;
      const field = 'created_at';

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query.ascending(field).toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should have uid', () => {
        expect(entry.uid).toBeDefined();
      });

      test('Entry should have locale', () => {
        expect(entry.locale).toBeDefined();
      });

      test('Entry should have publish_details', () => {
        expect(entry.publish_details).toBeDefined();
      });
    });

    describe('Descending', () => {
      let entry;
      let error = null;
      const field = 'created_at';

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query.descending(field).toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should have uid', () => {
        expect(entry.uid).toBeDefined();
      });

      test('Entry should have locale', () => {
        expect(entry.locale).toBeDefined();
      });

      test('Entry should have publish_details', () => {
        expect(entry.publish_details).toBeDefined();
      });
    });
  });

  describe('Comparison', () => {
    describe('lessThan', () => {
      let entry;
      let error = null;
      const value = 11;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.numbers_content_type).Query();
          entry = await Query.lessThan('num_field', value).toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('num_field should be less than specified value', () => {
        expect(entry.num_field).toBeLessThan(value);
      });

      test('Entry should have uid', () => {
        expect(entry.uid).toBeDefined();
      });

      test('Entry should have locale', () => {
        expect(entry.locale).toBeDefined();
      });

      test('Entry should have publish_details', () => {
        expect(entry.publish_details).toBeDefined();
      });
    });

    describe('lessThanOrEqualTo', () => {
      let entry;
      let error = null;
      const value = 11;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.numbers_content_type).Query();
          entry = await Query.lessThanOrEqualTo('num_field', value).toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('num_field should be less than or equal to specified value', () => {
        expect(entry.num_field).toBeLessThanOrEqual(value);
      });

      test('Entry should have uid', () => {
        expect(entry.uid).toBeDefined();
      });

      test('Entry should have locale', () => {
        expect(entry.locale).toBeDefined();
      });

      test('Entry should have publish_details', () => {
        expect(entry.publish_details).toBeDefined();
      });
    });

  });

  describe('Array/Subset', () => {
    describe('containedIn', () => {
      let entry;
      let error = null;
      const _in = ["source1", "source2"];

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query.containedIn('title', _in).toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry title should be in the specified values', () => {
        expect(_in).toContain(entry.title);
      });

      test('Entry should have uid', () => {
        expect(entry.uid).toBeDefined();
      });

      test('Entry should have locale', () => {
        expect(entry.locale).toBeDefined();
      });

      test('Entry should have publish_details', () => {
        expect(entry.publish_details).toBeDefined();
      });
    });

    describe('notContainedIn', () => {
      let entry;
      let error = null;
      const _in = ["source1", "source2", "source3", "source4"];

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query.notContainedIn('title', _in).toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should either return an entry or an expected error', () => {
        if (entry) {
          expect(entry).toBeDefined();
          expect(_in).not.toContain(entry.title);
          expect(entry.uid).toBeDefined();
          expect(entry.locale).toBeDefined();
          expect(entry.publish_details).toBeDefined();
        } else {
          expect(error).toEqual({ 
            error_code: 141, 
            error_message: 'The requested entry doesn\'t exist.' 
          });
        }
      });
    });
  });

  describe('Element Existence', () => {
    describe('exists', () => {
      let entry;
      let error = null;
      const queryField = "boolean";

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query.exists(queryField).toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should have the queried field', () => {
        expect(typeof entry[queryField]).not.toBe('undefined');
      });

      test('Entry should have uid', () => {
        expect(entry.uid).toBeDefined();
      });

      test('Entry should have locale', () => {
        expect(entry.locale).toBeDefined();
      });

      test('Entry should have publish_details', () => {
        expect(entry.publish_details).toBeDefined();
      });
    });

    describe('notExists', () => {
      let entry;
      let error = null;
      const queryField = "isspecial";

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query.notExists(queryField).toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should either have entry without field or proper error', () => {
        if (entry) {
          expect(typeof entry[queryField]).toBe('undefined');
          expect(entry.uid).toBeDefined();
          expect(entry.locale).toBeDefined();
          expect(entry.publish_details).toBeDefined();
        } else {
          expect(error).toEqual({ 
            error_code: 141, 
            error_message: 'The requested entry doesn\'t exist.' 
          });
        }
      });
    });
  });

  describe('Pagination', () => {
    describe('skip', () => {
      let allEntries;
      let skippedEntry;
      let error = null;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          allEntries = await Query.toJSON().find();
          
          const SkipQuery = Stack.ContentType(contentTypes.source).Query();
          skippedEntry = await SkipQuery.skip(1).toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
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
      let error = null;

      beforeAll(async () => {
        try {
          const Query1 = Stack.ContentType(contentTypes.source).Query().containedIn('title', ['source1', 'source2']);
          const Query2 = Stack.ContentType(contentTypes.source).Query().where('boolean', true);
          const Query = Stack.ContentType(contentTypes.source).Query();
          
          entry = await Query.or(Query1, Query2).toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should satisfy the OR condition', () => {
        const condition = (entry.title === 'source1' || 
                          entry.title === 'source2' || 
                          entry.boolean === true);
        expect(condition).toBeTruthy();
      });

      test('Entry should have uid', () => {
        expect(entry.uid).toBeDefined();
      });

      test('Entry should have locale', () => {
        expect(entry.locale).toBeDefined();
      });

      test('Entry should have publish_details', () => {
        expect(entry.publish_details).toBeDefined();
      });
    });

    describe('AND Query Objects', () => {
      let entry;
      let error = null;

      beforeAll(async () => {
        try {
          const Query1 = Stack.ContentType(contentTypes.source).Query().where('title', 'source1');
          const Query2 = Stack.ContentType(contentTypes.source).Query().where('boolean', true);
          const Query = Stack.ContentType(contentTypes.source).Query();
          
          entry = await Query.and(Query1, Query2).toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should satisfy the AND condition', () => {
        const condition = (entry.title === 'source1' && entry.boolean === true);
        expect(condition).toBeTruthy();
      });

      test('Entry should have uid', () => {
        expect(entry.uid).toBeDefined();
      });

      test('Entry should have locale', () => {
        expect(entry.locale).toBeDefined();
      });

      test('Entry should have publish_details', () => {
        expect(entry.publish_details).toBeDefined();
      });
    });

    describe('Raw Query', () => {
      let entry;
      let error = null;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query
            .query({ "$or": [{ "title": "source1" }, { "boolean": "false" }] })
            .toJSON()
            .findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should satisfy the OR condition in raw query', () => {
        const condition = (entry.title === 'source1' || entry.boolean === false);
        expect(condition).toBeTruthy();
      });

      test('Entry should have uid', () => {
        expect(entry.uid).toBeDefined();
      });

      test('Entry should have locale', () => {
        expect(entry.locale).toBeDefined();
      });

      test('Entry should have publish_details', () => {
        expect(entry.publish_details).toBeDefined();
      });
    });
  });

  describe('Localization', () => {
    describe('Without Fallback', () => {
      let entry;
      let error = null;
      const _in = ['ja-jp'];

      beforeAll(async () => {
        try {
          entry = await Stack.ContentType(contentTypes.source)
            .Query()
            .language('ja-jp')
            .toJSON()
            .findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
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
      let error = null;
      const _in = ['ja-jp', 'en-us'];

      beforeAll(async () => {
        try {
          entry = await Stack.ContentType(contentTypes.source)
            .Query()
            .language('ja-jp')
            .includeFallback()
            .toJSON()
            .findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
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
      let error = null;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query.includeReference('reference').toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('All present references should be included as objects', () => {
        expect(entry && entry.reference && typeof entry.reference === 'object').toBe(true);
      });
    });

    describe('includeReference - Array', () => {
      let entry;
      let error = null;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query.includeReference(['reference', 'other_reference']).toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('All present references should be included as objects', () => {
        const condition = (
          entry && 
          entry.reference && 
          typeof entry.reference === 'object' && 
          entry.other_reference && 
          typeof entry.other_reference === 'object'
        );
        expect(condition).toBe(true);
      });
    });
  });

  describe('Including Schema', () => {
    let entry;
    let error = null;

    beforeAll(async () => {
      try {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entry = await Query.includeSchema().toJSON().findOne();
      } catch (err) {
        error = err;
        console.error("Error:", err);
      }
    });

    test('Should return an entry', () => {
      expect(entry).toBeDefined();
    });
  });

  describe('Including ContentType', () => {
    let entry;
    let contentType;
    let error = null;

    beforeAll(async () => {
      try {
        const Query = Stack.ContentType(contentTypes.source).Query();
        [entry, contentType] = await new Promise((resolve, reject) => {
          Query.includeContentType()
            .toJSON()
            .findOne()
            .then((entry, contentType) => resolve([entry, contentType]), reject);
        });
      } catch (err) {
        error = err;
        console.error("Error:", err);
      }
    });

    test('Should return an entry', () => {
      expect(entry).toBeDefined();
    });

    test('ContentType should not be present', () => {
      expect(typeof contentType).toBe("undefined");
    });
  });

  describe('Including Schema and ContentType', () => {
    let entry;
    let contentType;
    let error = null;

    beforeAll(async () => {
      try {
        const Query = Stack.ContentType(contentTypes.source).Query();
        [entry, contentType] = await new Promise((resolve, reject) => {
          Query.includeSchema()
            .includeContentType()
            .toJSON()
            .findOne()
            .then((entry, contentType) => resolve([entry, contentType]), reject);
        });
      } catch (err) {
        error = err;
        console.error("Error:", err);
      }
    });

    test('Should return an entry', () => {
      expect(entry).toBeDefined();
    });

    test('ContentType should not be present', () => {
      expect(typeof contentType).toBe("undefined");
    });
  });

  describe('Field Selection - Only', () => {
    describe('only - Single String Parameter', () => {
      let entry;
      let error = null;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query.only('title').toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
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
      let error = null;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query.only('BASE', 'title').toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
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
      let error = null;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query.only(['title', 'url']).toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
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
      let error = null;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query
            .includeReference('reference')
            .only('BASE', 'reference')
            .only('reference', 'title')
            .toJSON()
            .findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('References should have only specified fields', () => {
        let flag = false;
        if (entry && entry['reference'] && typeof entry['reference'] === 'object') {
          flag = entry.reference.every(reference => 
            reference && "title" in reference && "uid" in reference);
        } else {
          flag = true;
        }
        expect(flag).toBe(true);
      });
    });

    describe('only - For reference - Array', () => {
      let entry;
      let error = null;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query
            .includeReference('reference')
            .only('BASE', ['reference'])
            .only('reference', ['title'])
            .toJSON()
            .findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('References should have only specified fields', () => {
        let flag = false;
        if (entry && entry['reference']) {
          if (entry['reference'].length) {
            if (entry['reference'].length === 0) {
              flag = true;
            } else {
              flag = entry.reference.every(reference => 
                reference && "title" in reference && "uid" in reference);
            }
          } else {
            flag = true;
          }
        } else {
          flag = true;
        }
        expect(flag).toBe(true);
      });
    });
  });

  describe('Field Selection - Except', () => {
    describe('except - Single String Parameter', () => {
      let entry;
      let error = null;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query.except('title').toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should not contain the title field', () => {
        expect(entry).not.toHaveProperty('title');
      });
    });

    describe('except - Multiple String Parameters', () => {
      let entry;
      let error = null;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query.except('BASE', 'title').toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should not contain the title field', () => {
        expect(entry).not.toHaveProperty('title');
      });
    });

    describe('except - Array Parameter', () => {
      let entry;
      let error = null;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query.except(['title', 'file']).toJSON().findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('Entry should not contain the title field', () => {
        expect(entry).not.toHaveProperty('title');
      });

      test('Entry should not contain the file field', () => {
        expect(entry).not.toHaveProperty('file');
      });
    });

    describe('except - For reference - String', () => {
      let entry;
      let error = null;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query
            .includeReference('reference')
            .only('BASE', 'reference')
            .except('reference', 'title')
            .toJSON()
            .findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('References should not contain the specified field', () => {
        let flag = false;
        if (entry && entry['reference'] && typeof entry['reference'] === 'object') {
          flag = entry.reference.every(reference => 
            reference && !("title" in reference));
        }
        expect(flag).toBeTruthy();
      });
    });

    describe('except - For reference - Array', () => {
      let entry;
      let error = null;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entry = await Query
            .includeReference('reference')
            .only('BASE', ['reference'])
            .except('reference', ['title'])
            .toJSON()
            .findOne();
        } catch (err) {
          error = err;
          console.error("Error:", err);
        }
      });

      test('Should return an entry', () => {
        expect(entry).toBeDefined();
      });

      test('References should not contain the specified field', () => {
        let flag = false;
        if (entry && entry['reference'] && typeof entry['reference'] === 'object') {
          flag = entry.reference.every(reference => 
            reference && !("title" in reference));
        }
        expect(flag).toBeTruthy();
      });
    });
  });

  describe('HTTP Error Handling', () => {
    describe('422 Unprocessable Entity Error', () => {
      let success = false;
      let error = null;

      beforeAll(async () => {
        try {
          const Query = Stack.ContentType("invalid_content_type").Query();
          await Query.toJSON().findOne();
          success = true;
        } catch (err) {
          error = err;
        }
      });

      test('Should not succeed', () => {
        expect(success).toBe(false);
      });

      test('Should return HTTP status 422', () => {
        expect(error.http_code).toBe(422);
      });

      test('Should have appropriate error message', () => {
        expect(error.http_message).toBeTruthy();
      });
    });

    describe('412 Unauthorized Error', () => {
      let success = false;
      let error = null;

      beforeAll(async () => {
        try {
          Stack.headers = { authorization: 'InvalidAPIKey' }; // Simulating an invalid API key
          const Query = Stack.ContentType(contentTypes.source).Query();
          await Query.toJSON().findOne();
          success = true;
        } catch (err) {
          error = err;
        } finally {
          // Reset headers for subsequent tests
          Stack.headers = {};
        }
      });

      test('Should not succeed', () => {
        expect(success).toBe(false);
      });

      test('Should return HTTP status 412', () => {
        expect(error.http_code).toBe(412);
      });

      test('Should have appropriate error message', () => {
        expect(error.http_message).toBeTruthy();
      });
    });
  });
});