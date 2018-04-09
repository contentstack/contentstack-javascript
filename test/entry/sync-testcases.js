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
    //console.log("Stack data is here", Stack);
        TC.end();
    }, 1000);
});

test('default .Init()', function(assert) {
    Stack
         .sync({"init" : "true"})
         .toJSON()
         .fetch()
         .then(function success(data) {
           sync_token = data[0].sync_token;   	
         	if(data[0].items.length === data[0].total_count) {
         		console.log("inside first")
          		assert.ok(data[0].items.length, 'Present Data and Totalcount is equal');
          	}
          	if(data[0].skip === 0){
          		console.log("inside second")
          		assert.ok('Sync Init method working fine');
          	}
          	assert.end();
         });
});

test('default .sync_token()', function(assert) {
    Stack
         .sync({"sync_token" : sync_token})
         .toJSON()
         .fetch()
         .then(function success(data) {   	
         	if(data[0].sync_token !== sync_token) {
          		assert.ok(data[0].items.length, 'New Sync Data Present');
          	}
          	assert.end();
         });
});