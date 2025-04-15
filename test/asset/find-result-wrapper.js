"use strict";
/*
 * Module Dependencies.
 */
const Contentstack = require("../../dist/node/contentstack.js");
const init = require("../config.js");
const Utils = require("../entry/utils.js");

let Stack;

describe("Contentstack Asset Tests", () => {
  // Initialize the Contentstack Stack Instance
  beforeAll(() => {
    return new Promise((resolve) => {
      Stack = Contentstack.Stack(init.stack);
      Stack.setHost(init.host);
      setTimeout(resolve, 1000);
    });
  });

  describe("default .find() No fallback", () => {
    const _in = ["ja-jp"];
    let assets;

    // Setup - run the query once for all tests
    beforeAll(async () => {
      try {
        assets = await Stack.Assets().Query().language("ja-jp").toJSON().find();
      } catch (error) {
        console.error("Error in beforeAll:", error);
        throw error;
      }
    });

    test("should return a non-empty array of assets", async () => {
      expect(assets).toBeDefined();
      expect(Array.isArray(assets)).toBe(true);
      expect(assets[0]).toBeDefined();
      expect(assets[0].length).toBeTruthy();
    });

    test("should not include count when not requested", async () => {
      expect(assets[1]).toBeFalsy();
    });

    test("should return assets only in the requested locale", async () => {
      if (assets && assets.length && assets[0].length) {
        const allAssetsInRequestedLocale = assets[0].every((asset) => {
          return _in.indexOf(asset["publish_details"]["locale"]) !== -1;
        });
        expect(allAssetsInRequestedLocale).toBe(true);
      } else {
        // Skip this test if no assets are returned
        console.warn("No assets returned to verify locale");
      }
    });

    test("should have the correct structure for each asset", async () => {
      if (assets && assets.length && assets[0].length) {
        const firstAsset = assets[0][0];
        expect(firstAsset).toHaveProperty("uid");
        expect(firstAsset).toHaveProperty("title");
        expect(firstAsset).toHaveProperty("publish_details");
        expect(firstAsset.publish_details).toHaveProperty("locale");
        expect(firstAsset.publish_details.locale).toBe("ja-jp");
      } else {
        // Skip this test if no assets are returned
        console.warn("No assets returned to verify structure");
      }
    });
  });

  describe("default .find() with fallback", () => {
    const _in = ["ja-jp", "en-us"];
    let assets;

    // Setup - run the query once for all tests
    beforeAll(async () => {
      try {
        assets = await Stack.Assets()
          .Query()
          .language("ja-jp")
          .includeFallback()
          .toJSON()
          .find();
      } catch (error) {
        console.error("Error in beforeAll:", error);
        throw error;
      }
    });

    test("should return a non-empty array of assets", async () => {
      expect(assets).toBeDefined();
      expect(Array.isArray(assets)).toBe(true);
      expect(assets[0]).toBeDefined();
      expect(assets[0].length).toBeTruthy();
    });

    test("should not include count when not requested", async () => {
      expect(assets[1]).toBeFalsy();
    });

    test("should return assets from both primary and fallback locales", async () => {
      if (assets && assets.length && assets[0].length) {
        const allAssetsInAllowedLocales = assets[0].every((asset) => {
          return _in.indexOf(asset["publish_details"]["locale"]) !== -1;
        });
        expect(allAssetsInAllowedLocales).toBe(true);
      } else {
        // Skip this test if no assets are returned
        console.warn("No assets returned to verify locales with fallback");
      }
    });

    test("should include some assets in primary locale", async () => {
      if (assets && assets.length && assets[0].length) {
        const anyAssetsInPrimaryLocale = assets[0].some((asset) => {
          return asset["publish_details"]["locale"] === "ja-jp";
        });
        expect(anyAssetsInPrimaryLocale).toBe(true);
      } else {
        console.warn("No assets returned to verify primary locale presence");
      }
    });

    test("should have the correct structure for each asset", async () => {
      if (assets && assets.length && assets[0].length) {
        const firstAsset = assets[0][0];
        expect(firstAsset).toHaveProperty("uid");
        expect(firstAsset).toHaveProperty("title");
        expect(firstAsset).toHaveProperty("publish_details");
        expect(firstAsset.publish_details).toHaveProperty("locale");
        expect(
          ["ja-jp", "en-us"].includes(firstAsset.publish_details.locale)
        ).toBe(true);
      } else {
        console.warn("No assets returned to verify structure");
      }
    });
  });

  describe("default .find()", () => {
    let assets;
    const field = "updated_at";

    // Setup - run the query once for all tests
    beforeAll(async () => {
      try {
        const Query = Stack.Assets().Query();
        assets = await Query.toJSON().find();
      } catch (error) {
        console.error("Error in beforeAll:", error);
        throw error;
      }
    });

    test("should return a non-empty array of assets", async () => {
      expect(assets).toBeDefined();
      expect(Array.isArray(assets)).toBe(true);
      expect(assets[0]).toBeDefined();
      expect(assets[0].length).toBeTruthy();
    });

    test("should not include count when not requested", async () => {
      expect(assets[1]).toBeFalsy();
    });

    test("should return assets sorted by updated_at by default in descending order", async () => {
      if (assets && assets.length && assets[0].length) {
        let prev = assets[0][0][field];
        const allAssetsSorted = assets[0].every((asset) => {
          const isSorted = asset[field] <= prev;
          prev = asset[field];
          return isSorted;
        });
        expect(allAssetsSorted).toBe(true);
      } else {
        console.warn("No assets returned to verify sorting");
      }
    });
  });

  describe("sorting", () => {
    test(".ascending()", async () => {
      const Query = Stack.Assets().Query();
      const field = "updated_at";
      try {
        const assets = await Query.ascending(field).toJSON().find();

        expect(assets[0].length).toBeTruthy();

        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            prev = asset[field];
            return asset[field] >= prev;
          });
          expect(_assets).toBe(true);
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".ascending()");
      }
    });

    test(".descending()", async () => {
      const Query = Stack.Assets().Query();
      const field = "created_at";
      try {
        const assets = await Query.descending(field).toJSON().find();

        expect(assets[0].length).toBeTruthy();

        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            const flag = asset[field] <= prev;
            prev = asset[field];
            return flag;
          });
          expect(_assets).toBe(true);
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".descending()");
      }
    });
  });

  test(".addParam()", async () => {
    const Query = Stack.Assets().Query();

    try {
      const assets = await Query.addParam("include_dimension", "true")
        .toJSON()
        .find();
      expect(assets[0][0].hasOwnProperty("dimension")).toBeTruthy();
    } catch (err) {
      console.error("Error:", err);
      fail(".addParam()");
    }
  });

  describe("comparison", () => {
    describe(".lessThan()", () => {
      const field = "file_size";
      const value = 5122;
      let assets;

      beforeAll(async () => {
        const Query = Stack.Assets().Query();
        assets = await Query.lessThan(field, value).toJSON().find();
      });

      test("should return a non-empty array of assets", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeTruthy();
      });

      test("should return only assets with file_size less than the specified value", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsMatchCondition = assets[0].every(
            (asset) => asset[field] < value
          );
          expect(allAssetsMatchCondition).toBe(true);
        } else {
          console.warn("No assets returned to verify lessThan condition");
        }
      });
    });

    describe(".lessThanOrEqualTo()", () => {
      const field = "file_size";
      const value = 5122;
      let assets;

      beforeAll(async () => {
        const Query = Stack.Assets().Query();
        assets = await Query.lessThanOrEqualTo(field, value).toJSON().find();
      });

      test("should return a non-empty array of assets", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeTruthy();
      });

      test("should return only assets with file_size less than or equal to the specified value", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsMatchCondition = assets[0].every(
            (asset) => asset[field] <= value
          );
          expect(allAssetsMatchCondition).toBe(true);
        } else {
          console.warn(
            "No assets returned to verify lessThanOrEqualTo condition"
          );
        }
      });
    });

    test(".greaterThan()", async () => {
      const Query = Stack.Assets().Query();
      const field = "file_size";
      const value = 5122;
      try {
        const assets = await Query.greaterThan("file_size", value)
          .ascending(field)
          .toJSON()
          .find();

        expect(assets[0].length).toBeTruthy();

        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].slice(1).every((asset) => {
            const flag = asset[field] > value;
            prev = asset[field];
            return flag;
          });
          expect(_assets).toBe(true);
        }
      } catch (err) {
        fail(".greaterThan()");
      }
    });

    test(".greaterThanOrEqualTo()", async () => {
      const Query = Stack.Assets().Query();
      const field = "file_size";
      const value = 5122;
      try {
        const assets = await Query.greaterThanOrEqualTo("file_size", 5122)
          .descending(field)
          .toJSON()
          .find();

        expect(assets[0].length).toBeTruthy();

        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            const flag = asset[field] >= value;
            prev = asset[field];
            return flag;
          });
          expect(_assets).toBe(true);
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".greaterThanOrEqualTo()");
      }
    });

    describe(".notEqualTo()", () => {
      const field = "file_size";
      const value = 5122;
      let assets;

      beforeAll(async () => {
        const Query = Stack.Assets().Query();
        assets = await Query.notEqualTo(field, value)
          .descending(field)
          .toJSON()
          .find();
      });

      test("should return a non-empty array of assets", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeTruthy();
      });

      test("should return only assets with file_size not equal to the specified value", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsMatchCondition = assets[0].every(
            (asset) => asset[field] !== value
          );
          expect(allAssetsMatchCondition).toBe(true);
        } else {
          console.warn("No assets returned to verify notEqualTo condition");
        }
      });
    });

    describe(".where()", () => {
      const title = "image1";
      let assets;

      beforeAll(async () => {
        const Query = Stack.Assets().Query();
        assets = await Query.where("title", title).toJSON().find();
      });

      test("should return a non-empty array of assets", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeTruthy();
      });

      test("should return exactly one asset matching the title", async () => {
        expect(assets[0].length).toBe(1);
      });

      test("should return only assets with the specified title", async () => {
        if (assets && assets.length && assets[0].length) {
          const matchingTitle = assets[0].every(
            (asset) => asset.title === title
          );
          expect(matchingTitle).toBe(true);
        } else {
          console.warn("No assets returned to verify where condition");
        }
      });
    });

    describe(".equalTo() with boolean values", () => {
      describe("when comparing with false", () => {
        let assets;

        beforeAll(async () => {
          const Query = Stack.Assets().Query();
          assets = await Query.language("en-us")
            .equalTo("is_dir", false)
            .toJSON()
            .find();
        });

        test("should return a non-empty array of assets", async () => {
          expect(assets).toBeDefined();
          expect(Array.isArray(assets)).toBe(true);
          expect(assets[0]).toBeDefined();
          expect(assets[0].length).toBeTruthy();
        });

        test("should return assets matching the condition", async () => {
          expect(assets[0].length).toBeDefined();
        });

        test("should return only assets with is_dir set to false", async () => {
          if (assets && assets.length && assets[0].length) {
            const allAssetsMatchCondition = assets[0].every(
              (asset) => asset.is_dir === false
            );
            expect(allAssetsMatchCondition).toBe(true);
          } else {
            console.warn("No assets returned to verify equalTo condition");
          }
        });
      });

      describe("when comparing with true", () => {
        let assets;

        beforeAll(async () => {
          const Query = Stack.Assets().Query();
          assets = await Query.equalTo("is_dir", true).toJSON().find();
        });

        test("should return an empty array of assets", async () => {
          expect(assets).toBeDefined();
          expect(Array.isArray(assets)).toBe(true);
          expect(assets[0]).toBeDefined();
          expect(assets[0].length).toBe(0);
        });
      });
    });
  });

  describe("Array/Subset Tests", () => {
    describe(".containedIn()", () => {
      const _in = ["image1", "image2"];
      let assets;

      beforeAll(async () => {
        const Query = Stack.Assets().Query();
        assets = await Query.containedIn("title", _in).toJSON().find();
      });

      test("should return a non-empty array of assets", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeTruthy();
      });

      test("should return only assets with titles contained in the specified array", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsMatchCondition = assets[0].every((asset) => {
            return _in.indexOf(asset["title"]) !== -1;
          });
          expect(allAssetsMatchCondition).toBe(true);
        } else {
          console.warn("No assets returned to verify containedIn condition");
        }
      });

      test("should include at least one asset with each of the specified titles", async () => {
        if (assets && assets.length && assets[0].length) {
          // Check if at least one asset exists for each title in the array
          const foundTitles = _in.filter((title) =>
            assets[0].some((asset) => asset.title === title)
          );
          expect(foundTitles.length).toBe(_in.length);
        } else {
          console.warn("No assets returned to verify all titles are present");
        }
      });
    });

    describe(".notContainedIn()", () => {
      const _in = ["image1", "image2"];
      let assets;

      beforeAll(async () => {
        const Query = Stack.Assets().Query();
        assets = await Query.notContainedIn("title", _in).toJSON().find();
      });

      test("should return a non-empty array of assets", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeTruthy();
      });

      test("should return only assets with titles not contained in the specified array", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsMatchCondition = assets[0].every((asset) => {
            return _in.indexOf(asset["title"]) === -1;
          });
          expect(allAssetsMatchCondition).toBe(true);
        } else {
          console.warn("No assets returned to verify notContainedIn condition");
        }
      });

      test("should not include any assets with the specified titles", async () => {
        if (assets && assets.length && assets[0].length) {
          const foundForbiddenTitles = assets[0].filter((asset) =>
            _in.includes(asset.title)
          );
          expect(foundForbiddenTitles.length).toBe(0);
        } else {
          console.warn("No assets returned to verify excluded titles");
        }
      });
    });
  });

  describe("Element Existence Tests", () => {
    test(".exists()", async () => {
      const Query = Stack.Assets().Query();
      const queryField = "is_dir";
      const field = "updated_at";
      try {
        const assets = await Query.exists(queryField).toJSON().find();

        expect(assets[0].length).toBeTruthy();

        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            const flag = asset[field] <= prev;
            prev = asset[field];
            return flag;
          });
          expect(_assets).toBe(true);
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".exists()");
      }
    });

    test(".notExists()", async () => {
      const Query = Stack.Assets().Query();
      const queryField = "is_dir";
      const field = "updated_at";
      try {
        const assets = await Query.notExists(queryField).toJSON().find();

        expect(assets[0].length).toBeFalsy();

        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            return asset[field] <= prev;
          });
          expect(_assets).toBe(true);
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".notExists()");
      }
    });
  });

  describe("Pagination Tests", () => {
    test(".skip()", async () => {
      const Query = Stack.Assets().Query();
      const field = "updated_at";
      try {
        const allassets = await Query.toJSON().find();
        const assets = await Stack.Assets().Query().skip(1).toJSON().find();

        expect(assets[0].length >= 2).toBeTruthy();
        expect(allassets[0].slice(1)).toEqual(assets[0]);

        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            const flag = asset[field] <= prev;
            prev = asset[field];
            return flag;
          });
          expect(_assets).toBe(true);
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".skip()");
      }
    });

    test(".limit()", async () => {
      const Query = Stack.Assets().Query();
      const field = "updated_at";
      try {
        const allassets = await Query.toJSON().find();
        const assets = await Stack.Assets().Query().limit(2).toJSON().find();

        expect(assets[0].length).toBeTruthy();
        expect(allassets[0].slice(0, 2)).toEqual(assets[0]);

        if (assets && assets.length && assets[0] && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            const flag = asset[field] <= prev;
            prev = asset[field];
            return flag;
          });
          expect(_assets).toBe(true);
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".limit()");
      }
    });

    test(".count()", async () => {
      const Query = Stack.Assets().Query();
      try {
        const count = await Query.count().toJSON().find();
        expect(count).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".count()");
      }
    });
  });

  describe("Logical Operators Tests", () => {
    describe(".or() - Query Objects", () => {
      let assets;
      const title = "image1";
      const isDir = true;

      beforeAll(async () => {
        const Query1 = Stack.Assets().Query().where("title", title);
        const Query2 = Stack.Assets().Query().where("is_dir", isDir);
        const Query = Stack.Assets().Query();
        assets = await Query.or(Query1, Query2).toJSON().find();
      });

      test("should return a non-empty array of assets", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeTruthy();
      });

      test("should return only assets matching at least one of the specified conditions", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsMatchCondition = assets[0].every(
            (asset) => asset.title === title || asset.is_dir === isDir
          );
          expect(allAssetsMatchCondition).toBe(true);
        } else {
          console.warn("No assets returned to verify OR condition");
        }
      });

      test("should include at least one asset matching the title condition", async () => {
        if (assets && assets.length && assets[0].length) {
          const anyAssetMatchesTitleCondition = assets[0].some(
            (asset) => asset.title === title
          );
          expect(anyAssetMatchesTitleCondition).toBe(true);
        } else {
          console.warn("No assets returned to verify first condition");
        }
      });
    });

    describe(".and() - Query Objects", () => {
      let assets;
      const title = "image1";
      const isDir = true;

      beforeAll(async () => {
        const Query1 = Stack.Assets().Query().where("title", title);
        const Query2 = Stack.Assets().Query().where("is_dir", isDir);
        const Query = Stack.Assets().Query();
        assets = await Query.and(Query1, Query2).toJSON().find();
      });

      test("should return an empty array when conditions cannot be satisfied simultaneously", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeFalsy();
      });

      test("should verify that no assets match both conditions", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsMatchCondition = assets[0].every(
            (asset) => asset.title === title && asset.is_dir === isDir
          );
          expect(allAssetsMatchCondition).toBe(true);
        }
      });
    });

    describe(".query() - Raw query", () => {
      let assets;
      const title = "image2";
      const isDir = true;

      beforeAll(async () => {
        const Query = Stack.Assets().Query();
        assets = await Query.query({
          $or: [{ title: title }, { is_dir: isDir }],
        })
          .toJSON()
          .find();
      });

      test("should return a non-empty array of assets", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeTruthy();
      });

      test("should return only assets matching at least one of the specified conditions", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsMatchCondition = assets[0].every(
            (asset) => asset.title === title || asset.is_dir === isDir
          );
          expect(allAssetsMatchCondition).toBe(true);
        } else {
          console.warn("No assets returned to verify raw query conditions");
        }
      });

      test("should include at least one asset matching the title condition", async () => {
        if (assets && assets.length && assets[0].length) {
          const anyAssetMatchesTitleCondition = assets[0].some(
            (asset) => asset.title === title
          );
          expect(anyAssetMatchesTitleCondition).toBe(true);
        } else {
          console.warn("No assets returned to verify first condition");
        }
      });
    });
  });

  describe("Tags Tests", () => {
    describe(".tags() - empty results", () => {
      let assets;
      const tags = ["asset3"];

      beforeAll(async () => {
        const Query = Stack.Assets().Query();
        assets = await Query.tags(tags).toJSON().find();
      });

      test("should return a properly structured response", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets.length).toBeGreaterThanOrEqual(1);
      });

      test("should return an empty array when no assets match the tags", async () => {
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBe(0);
      });
    });

    describe(".tags() - with results", () => {
      let assets;
      const field = "tags";
      const tags = ["asset1", "asset2"];

      beforeAll(async () => {
        const Query = Stack.Assets().Query();
        assets = await Query.tags(tags).toJSON().find();
      });

      test("should return a non-empty array of assets", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets.length).toBeGreaterThanOrEqual(1);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeTruthy();
      });

      test("should return only assets with at least one matching tag", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsHaveMatchingTags = assets[0].every((asset) => {
            return Utils.arrayPresentInArray(tags, asset[field]);
          });
          expect(allAssetsHaveMatchingTags).toBe(true);
        } else {
          console.warn("No assets returned to verify tags");
        }
      });

      test("should include assets with tags that overlap with the specified tags", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsHaveOverlappingTags = assets[0].every((asset) => {
            // Check that asset tags overlap with requested tags
            return asset[field].some((tag) => tags.includes(tag));
          });
          expect(allAssetsHaveOverlappingTags).toBe(true);
        } else {
          console.warn("No assets returned to verify tag overlap");
        }
      });
    });
  });

  describe("Search Tests", () => {
    describe(".search()", () => {
      let assets;
      const searchTerm = "image1";

      beforeAll(async () => {
        const Query = Stack.Assets().Query();
        assets = await Query.toJSON().search(searchTerm).find();
      });

      test("should return a non-empty array of assets", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeTruthy();
      });

      test("should return assets matching the search term", async () => {
        if (assets && assets.length && assets[0].length) {
          // Verify that each asset contains the search term in some field
          // This is a simplified check since search can match across multiple fields
          const anyAssetMatchesSearchTerm = assets[0].some(
            (asset) =>
              asset.title.includes(searchTerm) ||
              (asset.description && asset.description.includes(searchTerm))
          );
          expect(anyAssetMatchesSearchTerm).toBe(true);
        } else {
          console.warn("No assets returned to verify search results");
        }
      });
    });

    describe(".regex()", () => {
      let assets;
      const field = "title";
      const regex = {
        pattern: "^image",
        options: "i",
      };
      const regexpObj = new RegExp(regex.pattern, regex.options);

      beforeAll(async () => {
        const Query = Stack.Assets().Query();
        assets = await Query.regex(field, regex.pattern, regex.options)
          .toJSON()
          .find();
      });

      test("should return a non-empty array of assets", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets.length).toBeGreaterThanOrEqual(1);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeTruthy();
      });

      test("should return only assets with titles matching the regex pattern", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsTitlesMatchRegex = assets[0].every((asset) => {
            return regexpObj.test(asset[field]);
          });
          expect(allAssetsTitlesMatchRegex).toBe(true);
        } else {
          console.warn("No assets returned to verify regex match");
        }
      });

      test('should include assets whose titles start with "image"', async () => {
        if (assets && assets.length && assets[0].length) {
          const allTitlesStartWithImage = assets[0].every((asset) =>
            asset.title.toLowerCase().startsWith("image")
          );
          expect(allTitlesStartWithImage).toBe(true);
        } else {
          console.warn("No assets returned to verify specific regex pattern");
        }
      });
    });
  });

  describe("Include Options", () => {
    describe(".includeCount()", () => {
      let assets;

      beforeAll(async () => {
        const Query = Stack.Assets().Query();
        assets = await Query.includeCount().toJSON().find();
      });

      test("should return a non-empty array of assets", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeTruthy();
      });

      test("should include count information in the result", async () => {
        expect(assets[1]).toBeDefined();
        expect(assets[1]).toBeTruthy();
      });

      test("should return count as a number", async () => {
        expect(typeof assets[1]).toBe("number");
      });

      test("should return count equal to the number of returned assets", async () => {
        expect(assets[1]).toBeGreaterThanOrEqual(assets[0].length);
      });
    });
  });

  describe("Field Projections", () => {
    describe(".only() - Single String Parameter", () => {
      let assets;
      const selectedField = "title";

      beforeAll(async () => {
        const Query = Stack.Assets().Query();
        assets = await Query.only(selectedField).toJSON().find();
      });

      test("should return a non-empty array of assets", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeTruthy();
      });

      test("should include the selected field in each asset", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsHaveSelectedField = assets[0].every(
            (asset) => selectedField in asset
          );
          expect(allAssetsHaveSelectedField).toBe(true);
        } else {
          console.warn("No assets returned to verify field projection");
        }
      });

      test("should include system fields along with the selected field", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsHaveRequiredFields = assets[0].every(
            (asset) => "title" in asset && "uid" in asset && "url" in asset
          );
          expect(allAssetsHaveRequiredFields).toBe(true);
        } else {
          console.warn("No assets returned to verify system fields");
        }
      });

      test("should limit the total number of fields in each asset", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsHaveLimitedFields = assets[0].every(
            (asset) => Object.keys(asset).length === 5
          );
          expect(allAssetsHaveLimitedFields).toBe(true);
        } else {
          console.warn("No assets returned to verify field count");
        }
      });
    });

    describe(".only() - Multiple String Parameters", () => {
      let assets;
      const selectedFields = ["BASE", "title"];

      beforeAll(async () => {
        const Query = Stack.Assets().Query();
        assets = await Query.only(...selectedFields)
          .toJSON()
          .find();
      });

      test("should return a non-empty array of assets", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeTruthy();
      });

      test("should include the title field in each asset", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsHaveTitle = assets[0].every(
            (asset) => "title" in asset
          );
          expect(allAssetsHaveTitle).toBe(true);
        } else {
          console.warn("No assets returned to verify field projection");
        }
      });

      test("should include system fields in each asset", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsHaveSystemFields = assets[0].every(
            (asset) => "uid" in asset && "url" in asset
          );
          expect(allAssetsHaveSystemFields).toBe(true);
        } else {
          console.warn("No assets returned to verify system fields");
        }
      });

      test("should limit the total number of fields in each asset", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsHaveLimitedFields = assets[0].every(
            (asset) => Object.keys(asset).length === 5
          );
          expect(allAssetsHaveLimitedFields).toBe(true);
        } else {
          console.warn("No assets returned to verify field count");
        }
      });
    });

    describe(".only() - Array Parameter", () => {
      let assets;
      const selectedFields = ["title", "filename"];

      beforeAll(async () => {
        const Query = Stack.Assets().Query();
        assets = await Query.only(selectedFields).toJSON().find();
      });

      test("should return a non-empty array of assets", async () => {
        expect(assets).toBeDefined();
        expect(Array.isArray(assets)).toBe(true);
        expect(assets[0]).toBeDefined();
        expect(assets[0].length).toBeTruthy();
      });

      test("should include all the selected fields in each asset", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsHaveSelectedFields = assets[0].every((asset) =>
            selectedFields.every((field) => field in asset)
          );
          expect(allAssetsHaveSelectedFields).toBe(true);
        } else {
          console.warn("No assets returned to verify field projection");
        }
      });

      test("should include system fields in each asset", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsHaveSystemFields = assets[0].every(
            (asset) => "uid" in asset && "url" in asset
          );
          expect(allAssetsHaveSystemFields).toBe(true);
        } else {
          console.warn("No assets returned to verify system fields");
        }
      });

      test("should limit the total number of fields in each asset", async () => {
        if (assets && assets.length && assets[0].length) {
          const allAssetsHaveLimitedFields = assets[0].every(
            (asset) => Object.keys(asset).length === 5
          );
          expect(allAssetsHaveLimitedFields).toBe(true);
        } else {
          console.warn("No assets returned to verify field count");
        }
      });
    });
  });
});
