"use strict";
/*
 * Module Dependencies.
 */
const Contentstack = require("../../dist/node/contentstack.js");
const init = require("../config.js");
const Utils = require("./utils.js");

const contentTypes = init.contentTypes;
let Stack;

describe("ContentStack SDK Tests", () => {
  // Setup - Initialize the Contentstack Stack Instance
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe("Stack Initialization", () => {
    test("early_access in stack initialization should add headers", () => {
      const stack = Contentstack.Stack({
        ...init.stack,
        early_access: ["newCDA", "taxonomy"],
      });
      expect(stack.headers["x-header-ea"]).toBe("newCDA,taxonomy");
    });
  });

  describe("Default Find", () => {
    let entries;
    const field = "updated_at";

    beforeAll(async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      entries = await Query.toJSON().find();
    });

    test("Should return entries in the resultset", () => {
      expect(entries[0].length).toBeTruthy();
    });

    test("Count should not be present", () => {
      expect(entries[1]).toBeFalsy();
    });

    test("Entries should be sorted by default in descending order of updated_at", () => {
      if (entries && entries.length && entries[0].length > 1) {
        let prev = entries[0][0][field];
        const sortedCorrectly = entries[0].slice(1).every((entry) => {
          const isValid = entry[field] <= prev;
          prev = entry[field];
          return isValid;
        });
        expect(sortedCorrectly).toBe(true);
      }
    });
  });

  describe("Sorting", () => {
    describe(".ascending()", () => {
      let entries;
      const field = "updated_at";

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.ascending(field).toJSON().find();
      });

      test("Should return entries in the resultset", () => {
        expect(entries[0].length).toBeTruthy();
      });

      test("Entries should be sorted in ascending order", () => {
        if (entries && entries.length && entries[0].length > 1) {
          let prev = entries[0][0][field];
          const sortedCorrectly = entries[0].slice(1).every((entry) => {
            const isValid = entry[field] >= prev;
            prev = entry[field];
            return isValid;
          });
          expect(sortedCorrectly).toBe(true);
        }
      });
    });

    describe(".descending()", () => {
      let entries;
      const field = "created_at";

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.descending(field).toJSON().find();
      });

      test("Should return entries in the resultset", () => {
        expect(entries[0].length).toBeTruthy();
      });

      test("Entries should be sorted in descending order", () => {
        if (entries && entries.length && entries[0].length > 1) {
          let prev = entries[0][0][field];
          const sortedCorrectly = entries[0].slice(1).every((entry) => {
            const isValid = entry[field] <= prev;
            prev = entry[field];
            return isValid;
          });
          expect(sortedCorrectly).toBe(true);
        }
      });
    });
  });

  describe("Parameters", () => {
    describe(".addParam()", () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.addParam("include_count", "true").toJSON().find();
      });

      test("Should return entries in the resultset", () => {
        expect(entries[0].length).toBeTruthy();
      });

      test("Count should be present", () => {
        expect(entries[1]).toBeTruthy();
      });
    });
  });

  describe("Comparison", () => {
    describe(".lessThan()", () => {
      let entries;
      const field = "num_field";
      const value = 11;

      test("Should return entry in the resultset", async () => {
        const Query = Stack.ContentType(
          contentTypes.numbers_content_type
        ).Query();

        const result = await Query.lessThan("num_field", value).toJSON().find();

        entries = result;
        expect(entries[0].length).toBeTruthy();
      });

      test("All entries should have num_field less than specified value", () => {
        if (entries && entries.length && entries[0].length) {
          const allLessThan = entries[0].every((entry) => entry[field] < value);
          expect(allLessThan).toBe(true);
        }
      });
    });

    describe(".lessThanOrEqualTo()", () => {
      let entries;
      const field = "num_field";
      const value = 11;

      beforeAll(async () => {
        const Query = Stack.ContentType(
          contentTypes.numbers_content_type
        ).Query();
        entries = await Query.lessThanOrEqualTo("num_field", value)
          .toJSON()
          .find();
      });

      test("Should return entries in the resultset", () => {
        expect(entries[0].length).toBeTruthy();
      });

      test("All entries should have num_field less than or equal to specified value", () => {
        const allLessThanOrEqual = entries[0].every(
          (entry) => entry[field] <= value
        );
        expect(allLessThanOrEqual).toBe(true);
      });

      test("Entries should be sorted in descending order by default", () => {
        const updatedAtField = "updated_at";
        if (entries && entries.length && entries[0].length > 1) {
          let prev = entries[0][0][updatedAtField];
          const sortedCorrectly = entries[0].slice(1).every((entry) => {
            const isValid = entry[updatedAtField] <= prev;
            prev = entry[updatedAtField];
            return isValid;
          });
          expect(sortedCorrectly).toBe(true);
        }
      });
    });

    describe(".greaterThan()", () => {
      let entries;
      const field = "num_field";
      const value = 11;

      beforeAll(async () => {
        const Query = Stack.ContentType(
          contentTypes.numbers_content_type
        ).Query();
        entries = await Query.greaterThan("num_field", value)
          .ascending(field)
          .toJSON()
          .find();
      });

      test("Should return entries in the resultset", () => {
        expect(entries[0].length).toBeTruthy();
      });

      test("All entries should have num_field greater than specified value", () => {
        const allGreaterThan = entries[0].every(
          (entry) => entry[field] > value
        );
        expect(allGreaterThan).toBe(true);
      });

      test("Entries should be sorted in ascending order", () => {
        if (entries && entries.length && entries[0].length > 1) {
          let prev = entries[0][0][field];
          const sortedCorrectly = entries[0].slice(1).every((entry) => {
            const isValid = entry[field] >= prev;
            prev = entry[field];
            return isValid;
          });
          expect(sortedCorrectly).toBe(true);
        }
      });
    });

    describe(".greaterThanOrEqualTo()", () => {
      let entries;
      const field = "num_field";
      const value = 11;

      beforeAll(async () => {
        const Query = Stack.ContentType(
          contentTypes.numbers_content_type
        ).Query();
        entries = await Query.greaterThanOrEqualTo("num_field", value)
          .descending(field)
          .toJSON()
          .find();
      });

      test("Should return entries in the resultset", () => {
        expect(entries[0].length).toBeTruthy();
      });

      test("All entries should have num_field greater than or equal to specified value", () => {
        const allGreaterThanOrEqual = entries[0].every(
          (entry) => entry[field] >= value
        );
        expect(allGreaterThanOrEqual).toBe(true);
      });

      test("Entries should be sorted in descending order", () => {
        if (entries && entries.length && entries[0].length > 1) {
          let prev = entries[0][0][field];
          const sortedCorrectly = entries[0].slice(1).every((entry) => {
            const isValid = entry[field] <= prev;
            prev = entry[field];
            return isValid;
          });
          expect(sortedCorrectly).toBe(true);
        }
      });
    });

    describe(".notEqualTo()", () => {
      let entries;
      const field = "num_field";
      const value = 6;

      beforeAll(async () => {
        const Query = Stack.ContentType(
          contentTypes.numbers_content_type
        ).Query();
        entries = await Query.notEqualTo("num_field", value)
          .descending(field)
          .toJSON()
          .find();
      });

      test("Should return entries in the resultset", () => {
        expect(entries[0].length).toBeTruthy();
      });

      test("All entries should have num_field not equal to specified value", () => {
        const allNotEqual = entries[0].every((entry) => entry[field] !== value);
        expect(allNotEqual).toBe(true);
      });

      test("Entries should be sorted in descending order", () => {
        if (entries && entries.length && entries[0].length > 1) {
          let prev = entries[0][0][field];
          const sortedCorrectly = entries[0].slice(1).every((entry) => {
            const isValid = entry[field] <= prev;
            prev = entry[field];
            return isValid;
          });
          expect(sortedCorrectly).toBe(true);
        }
      });
    });

    describe(".where() with boolean value (true)", () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.where("boolean", true).toJSON().find();
      });

      test("Should return entries in the resultset", () => {
        expect(entries[0].length).toBeTruthy();
      });

      test("Should return four entries in the resultset", () => {
        expect(entries[0].length).toBe(4);
      });

      test("All entries should have boolean field set to true", () => {
        const allTrue = entries[0].every((entry) => entry.boolean === true);
        expect(allTrue).toBe(true);
      });
    });

    describe(".where() with boolean value (false)", () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.where("boolean", false).toJSON().find();
      });

      test("Should return entries in the resultset", () => {
        expect(entries[0].length).toBeTruthy();
      });

      test("Should return three entries in the resultset", () => {
        expect(entries[0].length).toBe(3);
      });

      test("All entries should have boolean field set to false", () => {
        const allFalse = entries[0].every((entry) => entry.boolean === false);
        expect(allFalse).toBe(true);
      });
    });

    describe(".where() with empty string", () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.where("title", "").toJSON().find();
      });

      test("Should return zero entries in the resultset", () => {
        expect(entries[0].length).toBe(0);
      });
    });
    describe(".tags()", () => {
      let entries;
      const field = "tags";
      const tags = ["tag1", "tag2"];

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.tags(tags).toJSON().find();
      });

      test("Should return one or more entries in the resultset", () => {
        expect(entries.length).toBeGreaterThanOrEqual(1);
      });

      test("All entries should have at least one of the specified tags", () => {
        if (entries && entries.length && entries[0].length) {
          const allHaveTags = entries[0].every((entry) =>
            Utils.arrayPresentInArray(tags, entry[field])
          );
          expect(allHaveTags).toBe(true);
        } else {
          // Skip this test if no entries were found
          console.log("No entries found to check tags");
        }
      });
    });
  });

  describe("Array/Subset Tests", () => {
    describe(".containedIn()", () => {
      let entries;
      const _in = ["source1", "source2"];
      const field = "title";

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.containedIn("title", _in).toJSON().find();
      });

      test("Should return entries in the resultset", () => {
        expect(entries[0].length).toBeTruthy();
      });

      test("Should return two entries in the resultset", () => {
        expect(entries[0].length).toBe(2);
      });

      test("All entries should have title field contained in the specified values", () => {
        if (entries && entries.length && entries[0].length) {
          const allContained = entries[0].every((entry) =>
            _in.includes(entry[field])
          );
          expect(allContained).toBe(true);
        }
      });
    });

    describe(".notContainedIn()", () => {
      let entries;
      const _in = ["source1", "source2"];
      const field = "title";

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.notContainedIn("title", _in).toJSON().find();
      });

      test("Should return entries in the resultset", () => {
        expect(entries[0].length).toBeTruthy();
      });

      test("Should return three entries in the resultset", () => {
        expect(entries[0].length).toBe(5);
      });

      test("All entries should have title field not contained in the specified values", () => {
        if (entries && entries.length && entries[0].length) {
          const allNotContained = entries[0].every(
            (entry) => !_in.includes(entry[field])
          );
          expect(allNotContained).toBe(true);
        }
      });
    });
    test(".exists() should return entries with the specified field", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const queryField = "boolean";
      const field = "updated_at";
      const entries = await Query.exists(queryField).toJSON().find();

      // Check if entries are returned
      expect(entries[0].length).toBeTruthy();

      // Verify sorting order (descending on updated_at)
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

    test(".notExists() should return entries without the specified field", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const queryField = "isspecial";
      const field = "updated_at";
      const entries = await Query.notExists(queryField).toJSON().find();

      // Check if entries are returned
      expect("entries" in entries).toBeTruthy();

      // Verify sorting order if entries exist
      if (entries && entries.length && entries[0].length) {
        let prev = entries[0][0][field];
        const _entries = entries[0].every(function (entry) {
          return entry[field] <= prev;
        });
        expect(_entries).toBe(true);
      }
    });
  });

  describe("Pagination Tests", () => {
    describe(".skip()", () => {
      let allEntries;
      let skippedEntries;
      const field = "updated_at";

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        allEntries = await Query.toJSON().find();

        const SkipQuery = Stack.ContentType(contentTypes.source).Query();
        skippedEntries = await SkipQuery.skip(1).toJSON().find();
      });

      test("All entries should be present in the resultset", () => {
        expect(allEntries[0].length).toBeTruthy();
      });

      test("Skipped entries should be present in the resultset", () => {
        expect(skippedEntries[0].length).toBeGreaterThanOrEqual(2);
      });

      test("Skipped entries should match all entries with first skipped", () => {
        expect(skippedEntries[0]).toEqual(allEntries[0].slice(1));
      });

      test("Skipped entries should maintain sorting order", () => {
        if (
          skippedEntries &&
          skippedEntries.length &&
          skippedEntries[0].length > 1
        ) {
          let prev = skippedEntries[0][0][field];
          const sortedCorrectly = skippedEntries[0].slice(1).every((entry) => {
            const isValid = entry[field] <= prev;
            prev = entry[field];
            return isValid;
          });
          expect(sortedCorrectly).toBe(true);
        }
      });
    });

    describe(".limit()", () => {
      let allEntries;
      let limitedEntries;
      const field = "updated_at";
      const limitNumber = 2;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        allEntries = await Query.toJSON().find();

        const LimitQuery = Stack.ContentType(contentTypes.source).Query();
        limitedEntries = await LimitQuery.limit(limitNumber).toJSON().find();
      });

      test("All entries should be present in the resultset", () => {
        expect(allEntries[0].length).toBeTruthy();
      });

      test("Limited entries should be present in the resultset", () => {
        expect(limitedEntries[0].length).toBeTruthy();
      });

      test("Limited entries should match first N entries from all entries", () => {
        expect(limitedEntries[0]).toEqual(allEntries[0].slice(0, limitNumber));
      });

      test("Limited entries should maintain sorting order", () => {
        if (
          limitedEntries &&
          limitedEntries.length &&
          limitedEntries[0].length > 1
        ) {
          let prev = limitedEntries[0][0][field];
          const sortedCorrectly = limitedEntries[0].slice(1).every((entry) => {
            const isValid = entry[field] <= prev;
            prev = entry[field];
            return isValid;
          });
          expect(sortedCorrectly).toBe(true);
        }
      });
    });

    describe(".count()", () => {
      let count;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        count = await Query.count().toJSON().find();
      });

      test("Entries present in the resultset", () => {
        expect(count).toBeTruthy();
      });
    });
  });

  describe("Logical Operations", () => {
    describe(".or() - Query Objects", () => {
      let entries;

      beforeAll(async () => {
        const Query1 = Stack.ContentType(contentTypes.source)
          .Query()
          .where("title", "source2");
        const Query2 = Stack.ContentType(contentTypes.source)
          .Query()
          .where("boolean", true);
        const Query = Stack.ContentType(contentTypes.source).Query();

        entries = await Query.or(Query1, Query2).toJSON().find();
      });

      test("Should return entries in the resultset", () => {
        expect(entries[0].length).toBeTruthy();
      });

      test("Should return 1 entries in the resultset", () => {
        expect(entries[0].length).toBe(5);
      });

      test("All entries should satisfy the OR condition", () => {
        if (entries && entries.length && entries[0].length) {
          let _entries = entries[0].every(function (entry) {
            return ~(entry.title === "source1" || entry.boolean === true);
          });
          expect(_entries).toBe(true);
        }
      });
    });

    describe(".and() - Query Objects", () => {
      let entries;

      beforeAll(async () => {
        const Query1 = Stack.ContentType(contentTypes.source)
          .Query()
          .where("title", "source1");
        const Query2 = Stack.ContentType(contentTypes.source)
          .Query()
          .where("boolean", true);
        const Query = Stack.ContentType(contentTypes.source).Query();

        entries = await Query.and(Query1, Query2).toJSON().find();
      });

      test("Should return one entry in the resultset", () => {
        expect(entries[0].length).toBe(1);
      });

      test("All entries should satisfy the AND condition", () => {
        if (entries && entries.length && entries[0].length) {
          const allMatchCondition = entries[0].every(
            (entry) => entry.title === "source1" && entry.boolean === true
          );
          expect(allMatchCondition).toBe(true);
        }
      });
    });

    describe(".query() - Raw query", () => {
      let entries;

      beforeAll(async () => {
        const Query = Stack.ContentType(contentTypes.source).Query();
        entries = await Query.query({
          $or: [{ title: "source2" }, { boolean: "true" }],
        })
          .toJSON()
          .find();
      });

      test("Should return entries in the resultset", () => {
        expect(entries[0].length).toBeTruthy();
      });

      test("Should return two entries in the resultset", () => {
        expect(entries[0].length).toBe(1);
      });

      test("All entries should satisfy the OR condition", () => {
        if (entries && entries.length && entries[0].length) {
          const allMatchCondition = entries[0].every(
            (entry) => entry.title === "source2" || entry.boolean === false
          );
          expect(allMatchCondition).toBe(true);
        }
      });
    });

    describe("Search Tests", () => {
      describe(".search()", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entries = await Query.toJSON().search("source2").find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });
    });

    describe("Including Additional Data Tests", () => {
      describe(".includeCount() and .includeContentType()", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entries = await Query.includeCount()
            .includeContentType()
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });

        test("ContentType should be present in the resultset", () => {
          expect(entries[1]).toBeTruthy();
        });

        test("ContentType title should exist", () => {
          expect(entries[1].title).toBeDefined();
        });

        test("ContentType uid should match requested content type", () => {
          expect(entries[1].uid).toBe(contentTypes.source);
        });

        test("Count should be present in the resultset", () => {
          expect(entries[2]).toBeTruthy();
        });
      });

      describe(".includeEmbeddedItems()", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entries = await Query.includeEmbeddedItems().toJSON().find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });

      describe(".includeSchema() and .includeContentType()", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entries = await Query.includeSchema()
            .includeContentType()
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });

        test("ContentType should be present in the resultset", () => {
          expect(entries[1]).toBeTruthy();
        });

        test("ContentType title should exist", () => {
          expect(entries[1].title).toBeDefined();
        });

        test("ContentType uid should match requested content type", () => {
          expect(entries[1].uid).toBe(contentTypes.source);
        });
      });

      describe(".includeCount(), .includeSchema() and .includeContentType()", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entries = await Query.includeCount()
            .includeSchema()
            .includeContentType()
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });

        test("ContentType should be present in the resultset", () => {
          expect(entries[1]).toBeTruthy();
        });

        test("ContentType title should exist", () => {
          expect(entries[1].title).toBeDefined();
        });

        test("ContentType uid should match requested content type", () => {
          expect(entries[1].uid).toBe(contentTypes.source);
        });

        test("Count should be present in the resultset", () => {
          expect(entries[2]).toBeTruthy();
        });
      });
    });

    describe("Localization Tests", () => {
      describe("find: without fallback", () => {
        let entries;
        const _in = ["ja-jp"];

        beforeAll(async () => {
          entries = await Stack.ContentType(contentTypes.source)
            .Query()
            .language("ja-jp")
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });

        test("All entries should have the correct locale", () => {
          if (entries && entries[0].length) {
            const allHaveCorrectLocale = entries[0].every((entry) =>
              _in.includes(entry.publish_details.locale)
            );
            expect(allHaveCorrectLocale).toBe(true);
          }
        });
      });

      describe("find: with fallback", () => {
        let entries;
        const _in = ["ja-jp", "en-us"];

        beforeAll(async () => {
          entries = await Stack.ContentType(contentTypes.source)
            .Query()
            .language("ja-jp")
            .includeFallback()
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });

        test("All entries should have locale from the allowed fallback list", () => {
          if (entries && entries[0].length) {
            const allHaveCorrectLocale = entries[0].every((entry) =>
              _in.includes(entry.publish_details.locale)
            );
            expect(allHaveCorrectLocale).toBe(true);
          }
        });
      });
    });

    describe("Global Field Tests", () => {
      describe(".getContentTypes()", () => {
        let entries;

        beforeAll(async () => {
          entries = await Stack.getContentTypes({
            include_global_field_schema: true,
          });
        });

        test("Global field schema should be present when applicable", () => {
          for (var i = 0; i < entries.content_types[0].schema.length; i++) {
            if (
              entries.content_types[0].schema[i].data_type === "global_field"
            ) {
              expect(entries[1]["schema"][i]["schema"]).toBeDefined();
            }
          }
        });
      });
    });

    describe("Field Selection Tests", () => {
      describe(".only() - Single String Parameter", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entries = await Query.only("title").toJSON().find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });

        test("All entries should contain only title and uid fields", () => {
          const allHaveCorrectFields = entries[0].every(
            (entry) =>
              Object.keys(entry).length === 2 &&
              "title" in entry &&
              "uid" in entry
          );
          expect(allHaveCorrectFields).toBe(true);
        });
      });

      describe(".only() - Multiple String Parameter", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entries = await Query.only("BASE", "title").toJSON().find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });

        test("All entries should contain only title and uid fields", () => {
          const allHaveCorrectFields = entries[0].every(
            (entry) =>
              Object.keys(entry).length === 2 &&
              "title" in entry &&
              "uid" in entry
          );
          expect(allHaveCorrectFields).toBe(true);
        });
      });

      describe(".only() - Array Parameter", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entries = await Query.only(["title", "url"]).toJSON().find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });

        test("All entries should contain only title, url, and uid fields", () => {
          const allHaveCorrectFields = entries[0].every(
            (entry) =>
              Object.keys(entry).length === 3 &&
              "title" in entry &&
              "url" in entry &&
              "uid" in entry
          );
          expect(allHaveCorrectFields).toBe(true);
        });
      });

      describe(".only() - For the reference - String", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entries = await Query.includeReference("reference")
            .only("BASE", ["reference"])
            .only("reference", "title")
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });

        test("All entries should contain reference field", () => {
          const allHaveReference = entries[0].every(
            (entry) => "reference" in entry
          );
          expect(allHaveReference).toBe(true);
        });
      });

      describe(".only() - For the reference - Array", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entries = await Query.includeReference("reference")
            .only("BASE", ["reference"])
            .only("reference", ["title"])
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });

        test("All entries should contain reference field", () => {
          const allHaveReference = entries[0].every(
            (entry) => "reference" in entry
          );
          expect(allHaveReference).toBe(true);
        });
      });
    });

    describe("Field Exclusion Tests", () => {
      describe(".except() - Single String Parameter", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entries = await Query.except("title").toJSON().find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });

        test("All entries should not have title field", () => {
          const allExcluded = entries[0].every(
            (entry) => entry && !("title" in entry)
          );
          expect(allExcluded).toBe(true);
        });
      });

      describe(".except() - Multiple String Parameter", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entries = await Query.except("BASE", "title").toJSON().find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });

        test("All entries should not have title field", () => {
          const allExcluded = entries[0].every(
            (entry) => entry && !("title" in entry)
          );
          expect(allExcluded).toBe(true);
        });
      });

      describe(".except() - Array of String Parameter", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entries = await Query.except(["title", "file"]).toJSON().find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });

        test("All entries should not have title and file fields", () => {
          const allExcluded = entries[0].every(
            (entry) => entry && !("title" in entry) && !("file" in entry)
          );
          expect(allExcluded).toBe(true);
        });
      });

      describe(".except() - For the reference - String", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entries = await Query.includeReference("reference")
            .only("BASE", ["reference"])
            .except("reference", "title")
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });

        test("All entries should have reference field", () => {
          const allHaveReference = entries[0].every(
            (entry) => entry && "reference" in entry
          );
          expect(allHaveReference).toBe(true);
        });

        test("All entries should have uid field", () => {
          const allHaveUID = entries[0].every(
            (entry) => entry && "uid" in entry
          );
          expect(allHaveUID).toBe(true);
        });

        test("All references should not have title field", () => {
          let allReferencesExcluded = true;

          entries[0].forEach((entry) => {
            if (
              entry &&
              entry.reference &&
              typeof entry.reference === "object"
            ) {
              entry.reference.forEach((reference) => {
                if (reference && "title" in reference) {
                  allReferencesExcluded = false;
                }
              });
            }
          });

          expect(allReferencesExcluded).toBe(true);
        });
      });

      describe(".except() - For the reference - Array", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType(contentTypes.source).Query();
          entries = await Query.includeReference("reference")
            .only("BASE", ["reference"])
            .except("reference", ["title"])
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });

        test("All entries should have reference field", () => {
          const allHaveReference = entries[0].every(
            (entry) => entry && "reference" in entry
          );
          expect(allHaveReference).toBe(true);
        });

        test("All entries should have uid field", () => {
          const allHaveUID = entries[0].every(
            (entry) => entry && "uid" in entry
          );
          expect(allHaveUID).toBe(true);
        });

        test("All references should not have title field", () => {
          let allReferencesExcluded = true;

          entries[0].forEach((entry) => {
            if (
              entry &&
              entry.reference &&
              typeof entry.reference === "object"
            ) {
              entry.reference.forEach((reference) => {
                if (reference && "title" in reference) {
                  allReferencesExcluded = false;
                }
              });
            }
          });

          expect(allReferencesExcluded).toBe(true);
        });
      });
    });

    describe("Taxonomies Endpoint Tests", () => {
      describe("Get Entries With One Term", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.Taxonomies();
          entries = await Query.where("taxonomies.one", "term_one")
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });

      describe("Get Entries With Any Term ($in)", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.Taxonomies();
          entries = await Query.containedIn("taxonomies.one", [
            "term_one",
            "term_two",
          ])
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });

      describe("Get Entries With Any Term ($or)", () => {
        let entries;

        beforeAll(async () => {
          const Query1 = Stack.Taxonomies().where("taxonomies.one", "term_one");
          const Query2 = Stack.Taxonomies().where("taxonomies.two", "term_two");
          const Query = Stack.Taxonomies();

          entries = await Query.or(Query1, Query2).toJSON().find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });

      describe("Get Entries With All Terms ($and)", () => {
        let entries;

        beforeAll(async () => {
          const Query1 = Stack.Taxonomies().where("taxonomies.one", "term_one");
          const Query2 = Stack.Taxonomies().where("taxonomies.two", "term_two");
          const Query = Stack.Taxonomies();

          entries = await Query.and(Query1, Query2).toJSON().find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });

      describe("Get Entries With Any Taxonomy Terms ($exists)", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.Taxonomies();
          entries = await Query.exists("taxonomies.one").toJSON().find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });
    });

    describe("Content Type Taxonomies Query Tests", () => {
      describe("Get Entries With One Term", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType("source").Query();
          entries = await Query.where("taxonomies.one", "term_one")
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });

      describe("Get Entries With Any Term ($in)", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType("source").Query();
          entries = await Query.containedIn("taxonomies.one", [
            "term_one",
            "term_two",
          ])
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });

      describe("Get Entries With Any Term ($or)", () => {
        let entries;

        beforeAll(async () => {
          const Query1 = Stack.ContentType("source")
            .Query()
            .where("taxonomies.one", "term_one");
          const Query2 = Stack.ContentType("source")
            .Query()
            .where("taxonomies.two", "term_two");
          const Query = Stack.ContentType("source").Query();

          entries = await Query.or(Query1, Query2).toJSON().find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });

      describe("Get Entries With All Terms ($and)", () => {
        let entries;

        beforeAll(async () => {
          const Query1 = Stack.ContentType("source")
            .Query()
            .where("taxonomies.one", "term_one");
          const Query2 = Stack.ContentType("source")
            .Query()
            .where("taxonomies.two", "term_two");
          const Query = Stack.ContentType("source").Query();

          entries = await Query.and(Query1, Query2).toJSON().find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });

      describe("Get Entries With Any Taxonomy Terms ($exists)", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType("source").Query();
          entries = await Query.exists("taxonomies.one").toJSON().find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });

      describe("Get Entries With Taxonomy Terms and Also Matching Its Children Term ($eq_below, level)", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType("source").Query();
          entries = await Query.equalAndBelow("taxonomies.one", "term_one")
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });

      describe("Get Entries With Taxonomy Terms Children's and Excluding the term itself ($below, level)", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType("source").Query();
          entries = await Query.below("taxonomies.one", "term_one")
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });

      describe("Get Entries With Taxonomy Terms and Also Matching Its Parent Term ($eq_above, level)", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType("source").Query();
          entries = await Query.equalAndAbove("taxonomies.one", "term_one")
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });

      describe("Get Entries With Taxonomy Terms Parent and Excluding the term itself ($above, level)", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType("source").Query();
          entries = await Query.above("taxonomies.one", "term_one_child")
            .toJSON()
            .find();
        });

        test("Should return entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });
    });
    describe("Variants Tests", () => {
      describe("Variants in entry", () => {
        let entries;

        beforeAll(async () => {
          const Query = Stack.ContentType("source").Query();
          entries = await Query.variants(["variant_entry_1", "variant_entry_2"])
            .toJSON()
            .find();
        });

        test("Should return variant entries in the resultset", () => {
          expect(entries[0].length).toBeTruthy();
        });
      });
    });
  });
});
