'use strict';
/*
 * Module Dependencies.
 */
const sync_testcase = require('tape');
const Contentstack = require('../../dist/node/contentstack.js');
const init = require('../sync_config.js');
const Utils = require('../entry/utils.js');

const contentTypes = init.contentTypes;

let Stack;
let sync_token = "bltbb61f31a70a572e6c9506a";
var total_count = 123;
var pagination_token = "bltcec0534f81e9550f0b2d7b";


/*
 * Initalise the Contentstack Instance
 * */
sync_testcase('Initalise the Contentstack Stack Instance', function(TC) {
    setTimeout(function() {
        Stack = Contentstack.Stack(init.stack);
        Stack.setHost(init.host);
        TC.end();
    }, 1000);
});

sync_testcase('default .Init()', function(assert) {
    Stack
         .sync({"init" : true})
         .then(function success(data) {
          assert.equal(data.total_count, total_count, "Present Data and Totalcount is equal");     	
          assert.end();
         });
});

sync_testcase('default .startdate()', function(assert) {
   var date_entry_count = 7
    Stack
         .sync({"init": true, "start_from": "2018-10-22"})
         .then(function success(data) {
             assert.equal(data.total_count, date_entry_count, "Present data and filtered data count on date bases is equal");       
             assert.end();
         });
});


sync_testcase('default .locale()', function(assert) {
    var locale_entry_count = 123;
    Stack
         .sync({"init": "true", "locale": "en-us"})
         .then(function success(data) {     
            assert.equal(data.total_count, locale_entry_count, "Present data and filtered data count on locale bases is equal");       
            assert.end();
         });
});

sync_testcase('default .localeDate()', function(assert) {
    var locale_date_entry_count = 7;
    Stack
         .sync({"init": true, "locale": "en-us", "start_from": "2018-10-22"})
         .then(function success(data) {
            assert.equal(data.total_count, locale_date_entry_count, "Present data and filtered data count on date and locale bases is equal");       
             assert.end();
         });
});


sync_testcase('default .pagination_token()', function(assert) {

    Stack
           .sync({"pagination_token" : pagination_token})
           .then(function success(result) {
            let pagination_count = result.items.length
                assert.equal(pagination_count, 23, "pagination_token testcase executed successfully");  
                assert.end();
           });  
});


sync_testcase('default .contentTypeUid()', function(assert) {
    var contenttype_count = 31;
    Stack
         .sync({"init": true, "content_type_uid": "session"})
         .then(function success(data) {
            assert.equal(data.total_count, contenttype_count, "Present data and filtered data total count on contentType bases is equal");       
            assert.end();
         });
});

sync_testcase('default .type()', function(assert) {
    var items_count = 8;
    Stack
         .sync({"init": true, "type": "asset_published"})
         .then(function success(data) {
            assert.equal(data.total_count, items_count, "Present data and filtered data total count on type bases is equal");       
            assert.end();
         });
});

sync_testcase('default .sync_token()', function(assert) {
   var sync_expected_count = 7 

   Stack
         .sync({"sync_token" :  sync_token})
         .then(function success(result) {
          assert.equal(result.total_count, sync_expected_count, "Synced Data and Sync_total_count is equal");      
          assert.end();
         });
});

