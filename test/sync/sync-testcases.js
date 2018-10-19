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
//let sync_token = "blt555aade6486cd7bb4a206d";
let sync_token = "bltb6f6ce871e0512420e5788";
var total_count = 125;
var pagination_token = "blt19cdbb5a99cff90278af9f";




//var sync_token = "blt4ce9ad919cffb996954483";
//var sync_token_count = ;
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
            console.log("datattatata", data)
         // assert.equal(data.total_count, total_count, "Present Data and Totalcount is equal");     	
         // assert.end();
         });
});

sync_testcase('default .startdate()', function(assert) {
   var date_entry_count = 17
    Stack
         .sync({"init": "true", "start_from": "2018-10-05"})
         .then(function success(data) {
            console.log("datatattatat", data)
             assert.equal(data.total_count, date_entry_count, "Present data and filtered data count on date bases is equal");       
             assert.end();
         });
});


sync_testcase('default .locale()', function(assert) {
    var locale_entry_count = 2;
    Stack
         .sync({"init": "true", "locale": "en-gb"})
         .then(function success(data) {
            assert.equal(data.total_count, locale_entry_count, "Present data and filtered data count on locale bases is equal");       
            assert.end();
         });
});

sync_testcase('default .localeDate()', function(assert) {
    var locale_date_entry_count = 2;
    Stack
         .sync({"init": "true", "locale": "en-gb", "start_from": "2018-10-05"})
         .then(function success(data) {
            assert.equal(data.total_count, locale_date_entry_count, "Present data and filtered data count on date and locale bases is equal");       
            assert.end();
         });
});


sync_testcase('default .pagination_token()', function(assert) {

    Stack
           .sync({"pagination_token : blt19cdbb5a99cff90278af9f"})
           .then(function success(result) {
            console.log("sdjchchdsjk", result)
                assert.equal(result.total_count, 25, "pagination_token testcase executed successfully");  
                assert.end();
           });  
      assert.end();
});


sync_testcase('default .contentTypeUid()', function(assert) {
    var contenttype_count = 29;
    Stack
         .sync({"init": "true", "content_type_uid": "session"})
         .then(function success(data) {
            assert.equal(data.total_count, contenttype_count, "Present data and filtered data total count on contentType bases is equal");       
            assert.end();
         });
});



 sync_testcase('default .sync_token()', function(assert) {
   var sync_expected_count = 3 

   Stack
         .sync({"sync_token" :  sync_token})
         .then(function success(result) {
            console.log("result++++++", result)
          assert.equal(data.total_count, sync_expected_count, "Synced Data and Sync_total_count is equal");      
          assert.end();
         });
});

