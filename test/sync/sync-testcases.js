'use strict';
/*
 * Module Dependencies.
 */
const test = require('tape');
const Contentstack = require('../../dist/node/contentstack.js');
const init = require('../sync_config.js');
const Utils = require('../entry/utils.js');

const contentTypes = init.contentTypes;



let Stack;
let sync_token;
var total_count = 91;
var pagination_token;
var sync_token = "blt4ce9ad919cffb996954483";
var sync_token_count;
/*
 * Initalise the Contentstack Instance
 * */
test('Initalise the Contentstack Stack Instance', function(TC) {
  console.log("iniiiii", init)
    setTimeout(function() {
        Stack = Contentstack.Stack(init.stack);
        Stack.setHost(init.host);
        TC.end();
    }, 1000);
});

test('default .Init()', function(assert) {
    Stack
         .sync({"init" : "true"})
         .then(function success(data) {
         assert.equal(data.total_count, total_count, "Present Data and Totalcount is equal");     	
         assert.end();
         });
});


// test('default .pagination_token()', function(assert) {

//     Stack
//          .sync({"init" : "true"})
//          .toJSON()
//          .fetch()
//          .then(function success(data) {
//             if(data.pagination_token) {

//                 let pagination_token = data.pagination_token 
//     Stack
//            .sync({"pagination_token" : pagination_token})
//            .toJSON()
//            .fetch()
//            .then(function success(result) {
//              let flag = false; 
//              if(result.skip === 100) {
//                 flag = true;
//              }
//                 assert.equal(flag, true, "pagination_token testcase executed successfully");  
//                 assert.end();
//            }); 
//             } else {
//                   assert.ok("pagination_token is not present");
//                   assert.end();  
//             }  
//          });   
//       assert.end();
// });


test('default .sync_token()', function(assert) {

   Stack
         .sync({"sync_token" :  sync_token})
         .then(function success(result) {
          assert.equal(data.total_count, sync_token_count, "Synced Data and Sync_total_count is equal");      
         assert.end();
         });
       });

