/**
 * Created by Aamod Pisat on 09-06-2017.
 */
'use strict';
/*
 * Module Dependencies.
 */
const Contentstack = require('../../dist/node/contentstack.js');
const init = require('../config.js');

const contentTypes = init.contentTypes;

let Stack;

describe('Spread Method Tests', () => {
  // Setup - Initialize the Contentstack Stack Instance
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('Entries as first argument', () => {
    const field = 'updated_at';

    test('Should have entries', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.limit(1)
        .toJSON()
        .find()
        .spread(function success (entries) {
          expect(entries.length).toBeTruthy();
        });
    });

    test('Should maintain default sorting of descending updated_at', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.limit(1)
        .toJSON()
        .find()
        .spread(function success (entries) {
          if (entries && entries.length) {
            let prev = entries[0][field];
            const _entries = entries.every((entry) => {
              prev = entry[field];
              return entry[field] <= prev;
            });
            expect(_entries).toBe(true);
          }
        });
    });
  });

  describe('With entries and count argument', () => {
    const field = 'updated_at';

    test('Should have entries as first parameter', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeCount()
        .toJSON()
        .find()
        .spread((entries) => {
          expect(entries.length).toBeTruthy();
        });
    });

    test('Should have count as second parameter', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeCount()
        .toJSON()
        .find()
        .spread((_, count) => {
          expect(count).toBeTruthy();
        });
    });

    test('Should maintain default sorting of descending updated_at', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeCount()
        .toJSON()
        .find()
        .spread((entries) => {
          if (entries && entries.length) {
            let prev = entries[0][field];
            const _entries = entries.every((entry) => {
              prev = entry[field];
              return entry[field] <= prev;
            });
            expect(_entries).toBe(true);
          }
        });
    });
  });

  describe('With entries, schema and count argument (includeSchema first)', () => {
    const field = 'updated_at';

    test('Should have entries as first parameter', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeSchema()
        .includeCount()
        .toJSON()
        .find()
        .spread((entries) => {
          expect(entries.length).toBeTruthy();
        });
    });

    test('Should have schema as second parameter', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeSchema()
        .includeCount()
        .toJSON()
        .find()
        .spread((_, schema) => {
          expect(schema).toBeTruthy();
        });
    });

    test('Should have count as third parameter', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeSchema()
        .includeCount()
        .toJSON()
        .find()
        .spread((_, __, count) => {
          expect(count).toBeTruthy();
        });
    });

    test('Should maintain default sorting of descending updated_at', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeSchema()
        .includeCount()
        .toJSON()
        .find()
        .spread((entries) => {
          if (entries && entries.length) {
            let prev = entries[0][field];
            const _entries = entries.every((entry) => {
              prev = entry[field];
              return entry[field] <= prev;
            });
            expect(_entries).toBe(true);
          }
        });
    });
  });

  describe('With entries, content_type and count argument (includeContentType first)', () => {
    const field = 'updated_at';

    test('Should have entries as first parameter', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeContentType()
        .includeCount()
        .toJSON()
        .find()
        .spread((entries) => {
          expect(entries.length).toBeTruthy();
        });
    });

    test('Should have contentType as second parameter', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeContentType()
        .includeCount()
        .toJSON()
        .find()
        .spread((_, contentType) => {
          expect(contentType).toBeTruthy();
        });
    });

    test('Should have correct contentType uid', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeContentType()
        .includeCount()
        .toJSON()
        .find()
        .spread((_, contentType) => {
          expect(contentType.uid).toBe(contentTypes.source);
        });
    });

    test('Should have count as third parameter', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeContentType()
        .includeCount()
        .toJSON()
        .find()
        .spread((_, __, count) => {
          expect(count).toBeTruthy();
        });
    });

    test('Should maintain default sorting of descending updated_at', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeContentType()
        .includeCount()
        .toJSON()
        .find()
        .spread((entries) => {
          if (entries && entries.length) {
            let prev = entries[0][field];
            const _entries = entries.every((entry) => {
              prev = entry[field];
              return entry[field] <= prev;
            });
            expect(_entries).toBe(true);
          }
        });
    });
  });

  describe('With entries, content_type|schema and count argument', () => {
    const field = 'updated_at';

    test('Should have entries as first parameter', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeCount()
        .includeSchema()
        .includeContentType()
        .toJSON()
        .find()
        .spread((entries) => {
          expect(entries.length).toBeTruthy();
        });
    });

    test('Should have contentType as second parameter', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeCount()
        .includeSchema()
        .includeContentType()
        .toJSON()
        .find()
        .spread((_, contentType) => {
          expect(contentType).toBeTruthy();
        });
    });

    test('Should have correct contentType uid', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeCount()
        .includeSchema()
        .includeContentType()
        .toJSON()
        .find()
        .spread((_, contentType) => {
          expect(contentType.uid).toBe(contentTypes.source);
        });
    });

    test('Should have count as third parameter', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeCount()
        .includeSchema()
        .includeContentType()
        .toJSON()
        .find()
        .spread((_, __, count) => {
          expect(count).toBeTruthy();
        });
    });

    test('Should maintain default sorting of descending updated_at', () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      Query.includeCount()
        .includeSchema()
        .includeContentType()
        .toJSON()
        .find()
        .spread((entries) => {
          if (entries && entries.length) {
            let prev = entries[0][field];
            const _entries = entries.every((entry) => {
              prev = entry[field];
              return entry[field] <= prev;
            });
            expect(_entries).toBe(true);
          }
        });
    });
  });
});
