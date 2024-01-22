'use strict';
/*
 * Module Dependencies.
 */
const test = require('tape');
const Contentstack = require('../../dist/node/contentstack.js');
const init = require('./../config.js');
const Utils = require('./../entry/utils.js');

const Regexp = new RegExp('\\\?', 'g');

let Stack;
let Asset;
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

test('Get All Assets', function(assert) {
    Stack
        .Assets()
        .Query()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 'Assets present in the resultset');
            Asset = assets[0][0];
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail("asset default .find()");
            assert.end();
        });
});

test('Valid URL: single parameter testing', function(assert) {
    const Params = {
        quality: 50
    }
    const URL = Asset.get('url');
    const Image = Stack.imageTransform(URL, Params);
    console.log("URL : ", Image, Image.match(Regexp));
    assert.ok((Image.match(Regexp).length === 1), "Valid URL is generated");
    for (var key in Params) {
        assert.ok((Image.indexOf('?' + key + '=' + Params[key]) !== -1), "Supplied parameter " + key + " found");
    }
    assert.ok((Image.match(Regexp).length === 1), "Valid URL is generated");
    assert.end();
});

test('Valid URL: multiple parameter testing', function(assert) {
    const Params = {
        quality: 50,
        auto: 'webp',
        format: 'jpg'
    }
    const URL = Asset.get('url');
    const Image = Stack.imageTransform(URL, Params);
    assert.ok((Image.match(Regexp).length === 1), "Valid URL is generated");
    for (var key in Params) {
        assert.ok((Image.indexOf(key + '=' + Params[key]) !== -1), "Supplied parameter " + key + " found");
    }
    assert.ok((Image.match(Regexp).length === 1), "Valid URL is generated");
    assert.end();
});

test('Invalid URL: single parameter testing', function(assert) {
    const Params = {
        quality: 50
    }
    const URL = Asset.get('url') + '?';
    const Image = Stack.imageTransform(URL, Params);
    assert.ok((Image.match(Regexp).length === 1), "Valid URL is generated");
    for (var key in Params) {
        assert.ok((Image.indexOf(key + '=' + Params[key]) !== -1), "Supplied parameter " + key + " found");
    }
    assert.ok((Image.match(Regexp).length === 1), "Valid URL is generated");
    assert.end();
});

test('Invalid URL: multiple parameter testing', function(assert) {
    const Params = {
        quality: 50,
        auto: 'webp',
        format: 'jpg'
    }
    const URL = Asset.get('url') + '?';
    const Image = Stack.imageTransform(URL, Params);
    assert.ok((Image.match(Regexp).length === 1), "Valid URL is generated");
    for (var key in Params) {
        assert.ok((Image.indexOf(key + '=' + Params[key]) !== -1), "Supplied parameter " + key + " found");
    }
    assert.ok((Image.match(Regexp).length === 1), "Valid URL is generated");
    assert.end();
});