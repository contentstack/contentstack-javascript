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

// test('default .initialSyncWithStartFrom()', function(assert) {
//     Stack
//          .initialSyncWithStartFrom({"init" : "true", "start_from" : "2018-04-03"})
//          .toJSON()
//          .fetch()
//          .then(function success(data) {
//           if(data[0].items.length === data[0].total_count) {
//               assert.ok(data[0].items.length, 'Present Data and Totalcount is equal');
//             }

//             var _entries = data[0].items.every(function(entry) {
//               var _time  = entry.data.publish_details.time;
//               var result = _time.split('T')

//                     var flag = (result >= data.start_from);
//                     return flag;
//                 });

//             assert.equal(_entries, true, "entries has sorted with start_from date");
//             assert.end();
//          });
// });


// test('default .pagination_token()', function(assert) {

//     Stack
//          .sync({"init" : "true"})
//          .toJSON()
//          .fetch()
//          .then(function success(data) {
//             let pagination_token = data.pagination_token 
//     Stack
//            .sync({"pagination_token" : pagination_token})
//            .toJSON()
//            .fetch()
//            .then(function success(result) {
//              let flag = false; 
//              if(result.skip === 100) {
//                 flag = true;
//              }
//              assert.equal(flag, true, "Next 100 entries has been displayed");  
//              assert.end();
//            });   
//          });   
//       assert.end();
// });


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