'use strict'

var ContentstackDemo = require('./contentstack-demo.js')

var Demo = new ContentstackDemo({'api_key': 'bltsomething1234', 'access_token': 'bltsomething1234asdf', 'environment': 'development'})

// get all the entries
Demo
    .getEntries('blog')
    .then(function (result) {
        // result object with entries
    })
    .catch(function (err) {
        // error of get all entries
    })

// get single entry
Demo
    .getEntry('home', 'blt1234567890')
    .then(function (result) {
        // result object with entry
    })
    .catch(function (err) {
        // error of get entry
    })