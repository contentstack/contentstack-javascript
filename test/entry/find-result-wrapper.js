"use strict";
/*
 * Module Dependencies.
 */
const Contentstack = require("../../dist/node/contentstack.js");
const init = require("../config.js");
const Utils = require("./utils.js");

const contentTypes = init.contentTypes;
let Stack;
let error = null;

describe("ContentStack SDK Tests", () => {
  // Initialize the Contentstack Stack Instance
  beforeAll(() => {
    return new Promise((resolve) => {
      Stack = Contentstack.Stack(init.stack);
      Stack.setHost(init.host);
      setTimeout(resolve, 1000);
    });
  });

  test("default .find()", async () => {
    const Query = Stack.ContentType(contentTypes.source).Query();
    const field = "updated_at";

    try {
      const entries = await Query.toJSON().find();

      expect(entries[0].length).toBeTruthy();
      expect(entries[1]).toBeFalsy();

      if (entries && entries.length && entries[0].length) {
        let prev = entries[0][0][field];
        const _entries = entries[0].every(function (entry) {
          prev = entry[field];
          return entry.updated_at <= prev;
        });
        expect(_entries).toBe(true);
      }
    } catch (err) {
      console.error("error:", err);
      fail("default .find()");
    }
  });

  describe("sorting", () => {
    test(".ascending()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const field = "updated_at";

      try {
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
      } catch (err) {
        console.error("error:", err);
        fail(".ascending()");
      }
    });

    test(".descending()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const field = "created_at";

      try {
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
      } catch (err) {
        console.error("error:", err);
        fail(".descending()");
      }
    });
  });

  describe("comparison", () => {
    test(".lessThan()", async () => {
      const Query = Stack.ContentType(
        contentTypes.numbers_content_type
      ).Query();
      const value = 11;
      const field = "updated_at";

      try {
        const entries = await Query.lessThan("num_field", value)
          .toJSON()
          .find();

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
      } catch (err) {
        console.error("error:", err);
        fail(".lessThan()");
      }
    });

    test(".lessThanOrEqualTo()", async () => {
      const Query = Stack.ContentType(
        contentTypes.numbers_content_type
      ).Query();
      const field = "updated_at";
      const value = 11;

      try {
        const entries = await Query.lessThanOrEqualTo("num_field", value)
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
      } catch (err) {
        console.error("error:", err);
        fail(".lessThanOrEqualTo()");
      }
    });

    test(".greaterThan()", async () => {
      const Query = Stack.ContentType(
        contentTypes.numbers_content_type
      ).Query();
      const field = "num_field";
      const value = 11;

      try {
        const entries = await Query.greaterThan("num_field", value)
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
      } catch (err) {
        console.error("error:", err);
        fail(".greaterThan()");
      }
    });

    test(".greaterThanOrEqualTo()", async () => {
      const Query = Stack.ContentType(
        contentTypes.numbers_content_type
      ).Query();
      const field = "num_field";
      const value = 11;

      try {
        const entries = await Query.greaterThanOrEqualTo("num_field", value)
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
      } catch (err) {
        console.error("error:", err);
        fail(".greaterThanOrEqualTo()");
      }
    });

    test(".notEqualTo()", async () => {
      const Query = Stack.ContentType(
        contentTypes.numbers_content_type
      ).Query();
      const field = "num_field";
      const value = 6;

      try {
        const entries = await Query.notEqualTo("num_field", value)
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
      } catch (err) {
        console.error("error:", err);
        fail(".notEqualTo()");
      }
    });
  });

  describe("array/subset", () => {
    test(".containedIn()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const _in = ["source1", "source2"];
      const field = "updated_at";

      try {
        const entries = await Query.containedIn("title", _in).toJSON().find();

        expect(entries[0].length).toBeTruthy();

        if (entries && entries.length && entries[0].length) {
          const _entries = entries[0].every(function (entry) {
            return _in.indexOf(entry["title"]) != -1;
          });
          expect(_entries).toBe(true);
        }
      } catch (err) {
        console.error("error:", err);
        fail(".containedIn()");
      }
    });

    test(".notContainedIn()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const _in = ["sourceddd1", "sourceddddd2"];

      try {
        const entries = await Query.notContainedIn("title", _in)
          .toJSON()
          .find();

        expect(entries[0].length).toBeTruthy();
      } catch (err) {
        console.error("error:", err);
        fail(".notContainedIn()");
      }
    });
  });

  describe("exists", () => {
    test(".exists()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const queryField = "boolean";
      const field = "updated_at";

      try {
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
      } catch (err) {
        console.error("error:", err);
        fail(".exists()");
      }
    });

    test(".notExists()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const queryField = "isspecial";
      const field = "updated_at";

      try {
        const entries = await Query.notExists(queryField).toJSON().find();

        expect("entries" in entries).toBeTruthy();

        if (entries && entries.length && entries[0].length) {
          let prev = entries[0][0][field];
          const _entries = entries[0].every(function (entry) {
            return entry[field] <= prev;
          });
          expect(_entries).toBe(true);
        }
      } catch (err) {
        console.error("error:", err);
        fail(".notExists()");
      }
    });
  });

  describe("pagination", () => {
    test(".skip()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const field = "updated_at";

      try {
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
      } catch (err) {
        console.error("error:", err);
        fail(".skip()");
      }
    });

    test(".limit()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const field = "updated_at";

      try {
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
      } catch (err) {
        console.error("error:", err);
        fail(".limit()");
      }
    });

    test(".count()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.count().toJSON().find();

        expect(entries[0]).toBeTruthy();
      } catch (err) {
        console.error("error:", err);
        fail(".count()");
      }
    });
  });

  describe("logical", () => {
    test(".or() - Query Objects", async () => {
      const Query1 = Stack.ContentType(contentTypes.source)
        .Query()
        .containedIn("title", ["source1", "source2"]);
      const Query2 = Stack.ContentType(contentTypes.source)
        .Query()
        .where("boolean", true);
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.or(Query1, Query2).toJSON().find();

        expect(entries[0].length).toBeTruthy();

        if (entries && entries.length && entries[0].length) {
          const _entries = entries[0].every(function (entry) {
            return ~(entry.title === "source1" || entry.boolean === true);
          });
          expect(_entries).toBeTruthy();
        }
      } catch (err) {
        console.error("error:", err);
        fail(".or() - Query Objects");
      }
    });

    test(".and() - Query Objects", async () => {
      const Query1 = Stack.ContentType(contentTypes.source)
        .Query()
        .where("title", "source1");
      const Query2 = Stack.ContentType(contentTypes.source)
        .Query()
        .where("boolean", true);
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.and(Query1, Query2).toJSON().find();

        expect(entries[0].length).toBeTruthy();

        if (entries && entries.length && entries[0].length) {
          const _entries = entries[0].every(function (entry) {
            return ~(entry.title === "source1" || entry.boolean === true);
          });
          expect(_entries).toBeTruthy();
        }
      } catch (err) {
        console.error("error:", err);
        fail(".and() - Query Objects");
      }
    });

    test(".and() - Raw queries", async () => {
      const Query1 = Stack.ContentType(contentTypes.source)
        .Query()
        .where("title", "source1");
      const Query2 = Stack.ContentType(contentTypes.source)
        .Query()
        .where("boolean", true);
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.and(Query1, Query2).toJSON().find();

        expect(entries[0].length).toBeTruthy();

        if (entries && entries.length && entries[0].length) {
          const _entries = entries[0].every(function (entry) {
            return ~(entry.title === "source1" || entry.boolean === true);
          });
          expect(_entries).toBeTruthy();
        }
      } catch (err) {
        console.error("error:", err);
        fail(".and() - Raw queries");
      }
    });
  });

  describe("custom query", () => {
    test(".query() - Raw query", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.query({
          $or: [{ title: "source1" }, { boolean: "true" }],
        })
          .toJSON()
          .find();

        expect(entries[0].length).toBeTruthy();

        if (entries && entries.length && entries[0].length) {
          const _entries = entries[0].every(function (entry) {
            return entry.title === "source1" || entry.boolean === true;
          });
          expect(_entries).toBeTruthy();
        }
      } catch (err) {
        console.error("error:", err);
        fail(".query() - Raw query");
      }
    });
  });

  describe("tags", () => {
    test(".tags()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const field = "tags";
      const tags = ["tag1", "tag2"];

      try {
        const entries = await Query.tags(tags).toJSON().find();

        expect(entries.length).toBeGreaterThanOrEqual(1);

        if (entries && entries.length && entries[0].length) {
          const _entries = entries[0].every(function (entry) {
            return Utils.arrayPresentInArray(tags, entry[field]);
          });
          expect(_entries).toBe(true);
        }
      } catch (err) {
        console.error("error:", err);
        fail(".tags()");
      }
    });
  });

  describe("search", () => {
    test(".search()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.search("source1").toJSON().find();

        expect(entries[0].length).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".search()");
      }
    });
  });

  describe("regex", () => {
    test(".regex()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();
      const field = "title";
      const regex = {
        pattern: "^source",
        options: "i",
      };
      const regexpObj = new RegExp(regex.pattern, regex.options);

      try {
        const entries = await Query.regex(field, regex.pattern, regex.options)
          .toJSON()
          .find();

        expect(entries.length).toBeGreaterThanOrEqual(1);

        const flag = entries[0].every(function (entry) {
          return regexpObj.test(entry[field]);
        });
        expect(flag).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".regex()");
      }
    });
  });

  describe("locale and fallback", () => {
    test("find: without fallback", async () => {
      const _in = ["ja-jp"];

      try {
        const entries = await Stack.ContentType(contentTypes.source)
          .Query()
          .language("ja-jp")
          .toJSON()
          .find();

        expect(entries[0].length).toBeTruthy();

        if (entries && entries.length && entries[0].length) {
          const _entries = entries[0].every(function (entry) {
            return _in.indexOf(entry["publish_details"]["locale"]) != -1;
          });
          expect(_entries).toBe(true);
        }
      } catch (error) {
        fail("Entries default .find() fallback catch: " + error.toString());
      }
    });

    test("find: fallback", async () => {
      const _in = ["ja-jp", "en-us"];

      try {
        const entries = await Stack.ContentType(contentTypes.source)
          .Query()
          .language("ja-jp")
          .includeFallback()
          .toJSON()
          .find();

        expect(entries[0].length).toBeTruthy();

        if (entries && entries.length && entries[0].length) {
          const _entries = entries[0].every(function (entry) {
            return _in.indexOf(entry["publish_details"]["locale"]) != -1;
          });
          expect(_entries).toBe(true);
        }
      } catch (error) {
        fail("Entries default .find() fallback catch: " + error.toString());
      }
    });
  });

  describe("include reference", () => {
    test(".includeReference() - String", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.includeReference("reference")
          .toJSON()
          .find();

        const flag = entries[0].every(function (entry) {
          return (
            entry &&
            entry["reference"] &&
            typeof entry["reference"] === "object"
          );
        });
        expect(flag).toBe(true);
      } catch (err) {
        console.error("Error:", err);
        fail(".includeReference() - String");
      }
    });

    test(".includeReference() - Array", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.includeReference([
          "reference",
          "other_reference",
        ])
          .toJSON()
          .find();

        const flag = entries[0].every(function (entry) {
          return (
            entry &&
            entry["reference"] &&
            typeof entry["reference"] === "object" &&
            entry["other_reference"] &&
            typeof entry["other_reference"] === "object"
          );
        });
        expect(flag).toBe(true);
      } catch (err) {
        console.error("Error:", err);
        fail(".includeReference() - Array");
      }
    });
  });

  describe("include count and schema", () => {
    test(".includeCount()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.includeCount().toJSON().find();

        expect(entries[0].length).toBeTruthy();
        expect(entries[1]).toBeTruthy();
      } catch (err) {
        console.error("error:", err);
        fail(".includeCount()");
      }
    });

    test(".includeSchema()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.includeSchema().toJSON().find();

        expect(entries[0].length).toBeTruthy();
        expect(entries[1].length).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".includeSchema()");
      }
    });

    test(".includeCount() and .includeSchema()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.includeCount()
          .includeSchema()
          .toJSON()
          .find();

        expect(entries[0].length).toBeTruthy();
        expect(entries[1].length).toBeTruthy();
        expect(entries[2]).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".includeSchema()");
      }
    });
  });

  describe("include contenttypes", () => {
    test(".includeContentType()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.includeContentType().toJSON().find();

        expect(entries[0].length).toBeTruthy();
        expect(entries[1]).toBeTruthy();
        expect(entries[1]["title"]).toBeTruthy();
        expect(entries[1]["uid"]).toBe(contentTypes.source);
      } catch (err) {
        console.error("error:", err);
        fail(".includeContentType()");
      }
    });

    test(".includeCount() and .includeContentType()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.includeCount()
          .includeContentType()
          .toJSON()
          .find();

        expect(entries[0].length).toBeTruthy();
        expect(entries[1]).toBeTruthy();
        expect(entries[1]["title"]).toBeTruthy();
        expect(entries[1]["uid"]).toBe(contentTypes.source);
        expect(entries[2]).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".includeCount && includeContentType");
      }
    });

    test(".includeSchema() and .includeContentType()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.includeSchema()
          .includeContentType()
          .toJSON()
          .find();

        expect(entries[0].length).toBeTruthy();
        expect(entries[1]).toBeTruthy();
        expect(entries[1]["title"]).toBeTruthy();
        expect(entries[1]["uid"]).toBe(contentTypes.source);
      } catch (err) {
        console.error("Error:", err);
        fail(".includeCount && includeContentType");
      }
    });

    test(".includeCount(), .includeSchema() and .includeContentType()", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.includeCount()
          .includeSchema()
          .includeContentType()
          .toJSON()
          .find();

        expect(entries[0].length).toBeTruthy();
        expect(entries[1]).toBeTruthy();
        expect(entries[1]["title"]).toBeTruthy();
        expect(entries[1]["uid"]).toBe(contentTypes.source);
        expect(entries[2]).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".includeCount && includeContentType");
      }
    });
  });

  describe("field projections", () => {
    test(".only() - Single String Parameter", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.only("title").toJSON().find();

        const flag = entries[0].every(function (entry) {
          return (
            entry &&
            Object.keys(entry).length === 2 &&
            "title" in entry &&
            "uid" in entry
          );
        });
        expect(flag).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".only() - Single String Parameter");
      }
    });

    test(".only() - Multiple String Parameter", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.only("BASE", "title").toJSON().find();

        const flag = entries[0].every(function (entry) {
          return (
            entry &&
            Object.keys(entry).length === 2 &&
            "title" in entry &&
            "uid" in entry
          );
        });
        expect(flag).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".only() - Multiple String Parameter");
      }
    });

    test(".only() - Array Parameter", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.only(["title", "url"]).toJSON().find();

        const flag = entries[0].every(function (entry) {
          return (
            entry &&
            Object.keys(entry).length === 3 &&
            "title" in entry &&
            "url" in entry &&
            "uid" in entry
          );
        });
        expect(flag).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".only() - Array Parameter");
      }
    });

    test(".only() - For the reference - String", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.includeReference("reference")
          .only("BASE", ["reference"])
          .only("reference", "title")
          .toJSON()
          .find();

        expect(entries).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".only() - For the reference - String");
      }
    });

    test(".only() - For the reference - Array", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.includeReference("reference")
          .only("BASE", ["reference"])
          .only("reference", ["title"])
          .toJSON()
          .find();

        expect(entries).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".only() - For the reference - Array");
      }
    });

    test(".except() - Single String Parameter", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.except("title").toJSON().find();

        const flag = entries[0].every(function (entry) {
          return entry && !("title" in entry);
        });
        expect(flag).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".except() - Single String Parameter");
      }
    });

    test(".except() - Multiple String Parameter", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.except("BASE", "title").toJSON().find();

        const flag = entries[0].every(function (entry) {
          return entry && !("title" in entry);
        });
        expect(flag).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".except() - Multiple String Parameter");
      }
    });

    test(".except() - Array of String Parameter", async () => {
      const Query = Stack.ContentType(contentTypes.source).Query();

      try {
        const entries = await Query.except(["title", "file"]).toJSON().find();

        const flag = entries[0].every(function (entry) {
          return entry && !("title" in entry) && !("file" in entry);
        });
        expect(flag).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".except() - Array of String Parameter");
      }
    });
    test(".except() - For the reference - String", async () => {
      try {
        const Query = Stack.ContentType(contentTypes.source).Query();

        const entries = await Query.includeReference("reference")
          .only("BASE", ["reference"])
          .except("reference", "title")
          .toJSON()
          .find();

        const flag = entries[0].every((entry) => {
          let _flag;
          if (
            entry &&
            entry["reference"] &&
            typeof entry["reference"] === "object"
          ) {
            _flag = true;
            _flag = entry.reference.every((reference) => {
              return reference && !("title" in reference);
            });
          } else {
            _flag = false;
          }
          return (
            _flag &&
            entry &&
            Object.keys(entry).length === 2 &&
            "reference" in entry &&
            "uid" in entry
          );
        });

        expect(flag).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".except() - For the reference - String");
      }
    });

    test(".except() - For the reference - Array", async () => {
      try {
        const Query = Stack.ContentType(contentTypes.source).Query();

        const entries = await Query.includeReference("reference")
          .only("BASE", ["reference"])
          .except("reference", ["title"])
          .toJSON()
          .find();

        const flag = entries[0].every((entry) => {
          let _flag;
          if (
            entry &&
            entry["reference"] &&
            typeof entry["reference"] === "object"
          ) {
            _flag = true;
            _flag = entry.reference.every((reference) => {
              return reference && !("title" in reference);
            });
          } else {
            _flag = false;
          }
          return (
            _flag &&
            entry &&
            Object.keys(entry).length === 2 &&
            "reference" in entry &&
            "uid" in entry
          );
        });

        expect(flag).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".except() - For the reference - Array");
      }
    });
  });
});
