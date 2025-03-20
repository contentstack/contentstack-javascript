'use strict';
/*
 * Module Dependencies.
 */
const Contentstack = require('../../dist/node/contentstack.js');
const init = require('../config.js');
const Utils = require('../entry/utils.js');

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

  describe("Language and Fallback Tests", () => {
    test('default .find() No fallback', async () => {
      const _in = ['ja-jp'];
      
      try {
        const assets = await Stack.Assets().Query().language('ja-jp').toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        expect(assets[1]).toBeFalsy();
        
        if (assets && assets.length && assets[0].length) {
          const _assets = assets[0].every((asset) => {
            return (_in.indexOf(asset['publish_details']['locale']) !== -1);
          });
          expect(_assets).toBe(true);
        }
      } catch (error) {
        console.error("Error:", error);
        fail("asset default .find() fallback catch: " + error.toString());
      }
    });

    test('default .find() fallback', async () => {
      const _in = ['ja-jp', 'en-us'];
      
      try {
        const assets = await Stack.Assets().Query().language('ja-jp').includeFallback().toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        expect(assets[1]).toBeFalsy();
        
        if (assets && assets.length && assets[0].length) {
          const _assets = assets[0].every((asset) => {
            return (_in.indexOf(asset['publish_details']['locale']) !== -1);
          });
          expect(_assets).toBe(true);
        }
      } catch (error) {
        console.error("Error:", error);
        fail("asset default .find() fallback catch: " + error.toString());
      }
    });
  });

  test('default .find()', async () => {
    const Query = Stack.Assets().Query();
    const field = 'updated_at';
    
    try {
      const assets = await Query.toJSON().find();
      
      expect(assets[0].length).toBeTruthy();
      expect(assets[1]).toBeFalsy();
      
      if (assets && assets.length && assets[0].length) {
        let prev = assets[0][0][field];
        const _assets = assets[0].every((asset) => {
          const flag = (asset[field] <= prev);
          prev = asset[field];
          return flag;
        });
        expect(_assets).toBe(true);
      }
    } catch (err) {
      console.error("Error:", err);
      fail("asset default .find()");
    }
  });

  describe("Sorting", () => {
    test('.ascending()', async () => {
      const Query = Stack.Assets().Query();
      const field = 'updated_at';
      
      try {
        const assets = await Query.ascending(field).toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        
        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            const flag = (asset[field] >= prev);
            prev = asset[field];
            return flag;
          });
          expect(_assets).toBe(true);
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".ascending()");
      }
    });

    test('.descending()', async () => {
      const Query = Stack.Assets().Query();
      const field = 'created_at';
      
      try {
        const assets = await Query.descending(field).toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        
        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            const flag = (asset[field] <= prev);
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

  describe("Params", () => {
    test('.addParam()', async () => {
      const Query = Stack.Assets().Query();
      
      try {
        const assets = await Query.addParam('include_dimension', 'true').toJSON().find();
        expect(assets[0][0].hasOwnProperty('dimension')).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".addParam()");
      }
    });
  });

  describe("Comparison", () => {
    test('.lessThan()', async () => {
      const Query = Stack.Assets().Query();
      const field = 'file_size';
      const value = 5122;
      
      try {
        const assets = await Query.lessThan('file_size', value).toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        
        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].slice(1).every((asset) => {
            const flag = (asset[field] < value);
            prev = asset[field];
            return flag;
          });
          expect(_assets).toBe(true);
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".lessThan()");
      }
    });

    test('.lessThanOrEqualTo()', async () => {
      const Query = Stack.Assets().Query();
      const field = 'updated_at';
      
      try {
        const assets = await Query.lessThanOrEqualTo('file_size', 5122).toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        
        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            const flag = (asset[field] <= prev);
            prev = asset[field];
            return flag;
          });
          expect(_assets).toBe(true);
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".lessThanOrEqualTo()");
      }
    });

    test('.greaterThan()', async () => {
      const Query = Stack.Assets().Query();
      const field = 'file_size';
      const value = 5122;
      
      try {
        const assets = await Query.greaterThan('file_size', value).ascending(field).toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        
        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].slice(1).every((asset) => {
            const flag = (asset[field] > value);
            prev = asset[field];
            return flag;
          });
          expect(_assets).toBe(true);
        }
      } catch (err) {
        fail(".greaterThan()");
      }
    });

    test('.greaterThanOrEqualTo()', async () => {
      const Query = Stack.Assets().Query();
      const field = 'file_size';
      const value = 5122;
      
      try {
        const assets = await Query.greaterThanOrEqualTo('file_size', value).descending(field).toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        
        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            const flag = (asset[field] >= value);
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

    test('.notEqualTo()', async () => {
      const Query = Stack.Assets().Query();
      const field = 'file_size';
      const value = 5122;
      
      try {
        const assets = await Query.notEqualTo('file_size', value).descending(field).toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        
        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            const flag = (asset[field] != value);
            prev = asset[field];
            return flag;
          });
          expect(_assets).toBe(true);
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".notEqualTo()");
      }
    });

    test('.where()', async () => {
      const Query = Stack.Assets().Query();
      
      try {
        const assets = await Query.where('title', "image1").toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        expect(assets[0].length).toBe(1);
      } catch (err) {
        console.error("Error:", err);
        fail(".where()");
      }
    });

    test('.equalTo() compare boolean value (true)', async () => {
      const Query = Stack.Assets().Query();
      
      try {
        const assets = await Query.language('en-us').equalTo('is_dir', false).toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        expect(assets[0].length).toBe(5);
      } catch (err) {
        console.error("Error:", err);
        fail(".where()");
      }
    });

    test('.equalTo() compare boolean value (false)', async () => {
      const Query = Stack.Assets().Query();
      
      try {
        const assets = await Query.equalTo('is_dir', true).toJSON().find();
        
        expect(assets[0].length).toBeFalsy();
        expect(assets[0].length).toBe(0);
      } catch (err) {
        console.error("Error:", err);
        fail(".where() boolean value having false");
      }
    });
  });

  describe("Array/Subset Tests", () => {
    test('.containedIn()', async () => {
      const Query = Stack.Assets().Query();
      const _in = ["image1", "image2"];
      const field = 'updated_at';
      
      try {
        const assets = await Query.containedIn('title', _in).toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        
        if (assets && assets.length && assets[0].length) {
          const _assets = assets[0].every((asset) => {
            return (_in.indexOf(asset['title']) != -1);
          });
          expect(_assets).toBe(true);
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".containedIn()");
      }
    });

    test('.notContainedIn()', async () => {
      const Query = Stack.Assets().Query();
      const _in = ["image1", "image2"];
      
      try {
        const assets = await Query.notContainedIn('title', _in).toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".notContainedIn()");
      }
    });
  });

  describe("Element Existence Tests", () => {
    test('.exists()', async () => {
      const Query = Stack.Assets().Query();
      const queryField = "is_dir";
      const field = 'updated_at';
      
      try {
        const assets = await Query.exists(queryField).toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        
        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            const flag = (asset[field] <= prev);
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

    test('.notExists()', async () => {
      const Query = Stack.Assets().Query();
      const queryField = "is_dir";
      const field = 'updated_at';
      
      try {
        const assets = await Query.notExists(queryField).toJSON().find();
        
        expect(assets[0].length).toBeFalsy();
        
        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            return (asset[field] <= prev);
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
    test('.skip()', async () => {
      const Query = Stack.Assets().Query();
      const field = 'updated_at';
      
      try {
        const allassets = await Query.toJSON().find();
        const assets = await Stack.Assets().Query().skip(1).toJSON().find();
        
        expect(assets[0].length >= 2).toBeTruthy();
        expect(allassets[0].slice(1)).toEqual(assets[0]);
        
        if (assets && assets.length && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            const flag = (asset[field] <= prev);
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

    test('.limit()', async () => {
      const Query = Stack.Assets().Query();
      const field = 'updated_at';
      
      try {
        const allassets = await Query.toJSON().find();
        const assets = await Stack.Assets().Query().limit(2).toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        expect(allassets[0].slice(0, 2)).toEqual(assets[0]);
        
        if (assets && assets.length && assets[0] && assets[0].length) {
          let prev = assets[0][0][field];
          const _assets = assets[0].every((asset) => {
            const flag = (asset[field] <= prev);
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

    test('.count()', async () => {
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
    test('.or() - Query Objects', async () => {
      const Query1 = Stack.Assets().Query().where('title', 'image1');
      const Query2 = Stack.Assets().Query().where('is_dir', true);
      const Query = Stack.Assets().Query();
      
      try {
        const assets = await Query.or(Query1, Query2).toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        
        if (assets && assets.length && assets[0].length) {
          const _assets = assets[0].every((asset) => {
            return (~(asset.title === 'source1' || asset.is_dir === true));
          });
          expect(_assets).toBeTruthy();
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".or() - Query Objects");
      }
    });

    test('.and() - Query Objects', async () => {
      const Query1 = Stack.Assets().Query().where('title', 'image1');
      const Query2 = Stack.Assets().Query().where('is_dir', true);
      const Query = Stack.Assets().Query();
      
      try {
        const assets = await Query.and(Query1, Query2).toJSON().find();
        
        expect(assets[0].length).toBeFalsy();
        
        if (assets && assets.length && assets[0].length) {
          const _assets = assets[0].every((asset) => {
            return (~(asset.title === 'image1' && asset.is_dir === true));
          });
          expect(_assets).toBeTruthy();
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".and() - Query Objects");
      }
    });

    test('.query() - Raw query', async () => {
      const Query = Stack.Assets().Query();
      
      try {
        const assets = await Query.query({ "$or": [{ "title": "image2" }, { "is_dir": "true" }] }).toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        
        if (assets && assets.length && assets[0].length) {
          const _assets = assets[0].every((asset) => {
            return (asset.title === 'image2' || asset.is_dir === false);
          });
          expect(_assets).toBeTruthy();
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".query() - Raw query");
      }
    });
  });

  describe("Tags Tests", () => {
    test('.tags() - empty results', async () => {
      const Query = Stack.Assets().Query();
      const tags = ["asset3"];
      
      try {
        const assets = await Query.tags(tags).toJSON().find();
        
        expect(assets.length >= 1).toBeTruthy();
        
        if (assets && assets.length && assets[0].length) {
          expect(assets[0].length).toBe(0);
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".tags()");
      }
    });

    test('.tags() - with results', async () => {
      const Query = Stack.Assets().Query();
      const field = 'tags';
      const tags = ["asset1", "asset2"];
      
      try {
        const assets = await Query.tags(tags).toJSON().find();
        
        expect(assets.length >= 1).toBeTruthy();
        
        if (assets && assets.length && assets[0].length) {
          const _assets = assets[0].every((asset) => {
            return (Utils.arrayPresentInArray(tags, asset[field]));
          });
          expect(_assets).toBe(true);
        }
      } catch (err) {
        console.error("Error:", err);
        fail(".tags()");
      }
    });
  });

  describe("Search Tests", () => {
    test('.search()', async () => {
      const Query = Stack.Assets().Query();
      
      try {
        const assets = await Query.toJSON().search('image1').find();
        expect(assets[0].length).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".search()");
      }
    });

    test('.regex()', async () => {
      const Query = Stack.Assets().Query();
      const field = 'title';
      const regex = {
        pattern: '^image',
        options: 'i'
      };
      const regexpObj = new RegExp(regex.pattern, regex.options);
      
      try {
        const assets = await Query.regex(field, regex.pattern, regex.options).toJSON().find();
        
        expect(assets.length >= 1).toBeTruthy();
        
        const flag = assets[0].every((asset) => {
          return regexpObj.test(asset[field]);
        });
        expect(flag).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".regex()");
      }
    });
  });

  describe("Include Options", () => {
    test('.includeCount()', async () => {
      const Query = Stack.Assets().Query();
      
      try {
        const assets = await Query.includeCount().toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        expect(assets[1]).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".includeCount()");
      }
    });
  });

  describe("Field Projections", () => {
    test('.only() - Single String Parameter', async () => {
      const Query = Stack.Assets().Query();
      
      try {
        const assets = await Query.only('title').toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        
        const flag = assets[0].every((asset) => {
          return (asset && Object.keys(asset).length === 5 && "title" in asset && "uid" in asset && 'url' in asset);
        });
        expect(flag).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".only() - Single String Parameter");
      }
    });

    test('.only() - Multiple String Parameter', async () => {
      const Query = Stack.Assets().Query();
      
      try {
        const assets = await Query.only('BASE', 'title').toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        
        const flag = assets[0].every((asset) => {
          return (asset && Object.keys(asset).length === 5 && "title" in asset && "uid" in asset && 'url' in asset);
        });
        expect(flag).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".only() - Multiple String Parameter");
      }
    });

    test('.only() - Array Parameter', async () => {
      const Query = Stack.Assets().Query();
      
      try {
        const assets = await Query.only(['title', 'filename']).toJSON().find();
        
        expect(assets[0].length).toBeTruthy();
        
        const flag = assets[0].every((asset) => {
          return (asset && Object.keys(asset).length === 5 && "title" in asset && "filename" in asset && "uid" in asset && "url" in asset);
        });
        expect(flag).toBeTruthy();
      } catch (err) {
        console.error("Error:", err);
        fail(".only() - Array Parameter");
      }
    });
  });
});