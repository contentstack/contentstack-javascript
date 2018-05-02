'use strict';
/*
 * Module Dependencies.
 */
const test = require('tape');
const Contentstack = require('../../dist/node/contentstack.js');
const init = require('../config.js');
const Utils = require('./utils.js');

const contentTypes = init.contentTypes;

let Stack;
let sync_token;

/*
 * Initalise the Contentstack Instance
 * */
test('Initalise the Contentstack Stack Instance', function(TC) {
    setTimeout(function() {
        Stack = Contentstack.Stack(init.stack);
        Stack.setHost(init.host);
        TC.end();
    }, 1000);
});

// test('default .Init()', function(assert) {
//     Stack
//          .sync({"init" : "true"})
//          .toJSON()
//          .fetch()
//          .then(function success(data) {
//            sync_token = data[0].sync_token;   	
//          	if(data[0].items.length === data[0].total_count) {
//           		assert.ok(data[0].items.length, 'Present Data and Totalcount is equal');
//           	}
//           	if(data[0].skip === 0){
//           		assert.ok('Sync Init method working fine');
//           	}
//           	assert.end();
//          });
// });


test('default .pagination_token()', function(assert) {

    Stack
         .sync({"init" : "true"})
         .toJSON()
         .fetch()
         .then(function success(data) {
            if(data.pagination_token) {

                let pagination_token = data.pagination_token 
    Stack
           .sync({"pagination_token" : pagination_token})
           .toJSON()
           .fetch()
           .then(function success(result) {
             let flag = false; 
             if(result.skip === 100) {
                flag = true;
             }
                assert.equal(flag, true, "pagination_token testcase executed successfully");  
                assert.end();
           }); 
            } else {
                  assert.ok("pagination_token is not present");
                  assert.end();  
            }  
         });   
      assert.end();
});


test('default .sync_token()', function(assert) {

   Stack
         .sync({"init" : "true"})
         .toJSON()
         .fetch()
         .then(function success(data) {
        let sync_token = data[0].sync_token
    Stack
         .sync({"sync_token" : sync_token})
         .toJSON()
         .fetch()
         .then(function success(result) {
          assert.ok(result.length, "sync_token testcases executed successfully ");
        assert.end();
         });

       });
});