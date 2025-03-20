/**
 * Created by Aamod Pisat on 09-06-2017.
 */
'use strict';
/*
 * Module Dependencies.
 */
const Contentstack = require('../../dist/node/contentstack.js');
const init = require('../config.js');

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

  test('assets as first argument', async () => {
    const Query = Stack.Assets().Query();
    const field = 'updated_at';

    try {
      const result = await Query
        .limit(1)
        .toJSON()
        .find();
        
      const assets = result[0]; // Using array destructuring
      
      expect(assets.length).toBeTruthy();
      
      if (assets && assets.length) {
        let prev = assets[0][field];
        const _assets = assets.every((asset) => {
          prev = asset[field];
          return (asset[field] <= prev);
        });
        expect(_assets).toBe(true);
      }
    } catch (err) {
      console.error("Error:", err);
      fail("assets as first argument test failed");
    }
  });

  test('with assets and count argument', async () => {
    const Query = Stack.Assets().Query();
    const field = 'updated_at';
    
    try {
      const result = await Query
        .includeCount()
        .toJSON()
        .find();
        
      const [assets, count] = result; // Using array destructuring
      
      expect(assets.length).toBeTruthy();
      expect(count).toBeTruthy();
      
      if (assets && assets.length) {
        let prev = assets[0][field];
        const _assets = assets.every((asset) => {
          prev = asset[field];
          return (asset[field] <= prev);
        });
        expect(_assets).toBe(true);
      }
    } catch (err) {
      console.error("Error:", err);
      fail("with assets and count argument test failed");
    }
  });
});