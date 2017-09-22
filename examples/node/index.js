'use strict'

const ContentstackDemo = require('./contentstack-demo.js')

const Demo = new ContentstackDemo({'api_key': 'blt123something', 'access_token': 'blt123something', 'environment': 'development'})

// get all the entries
Demo
    .getEntries('source')
    .spread(function (result) {
        console.info("Result: ", result)
        // result object with entries
    })
    .catch(function (err) {
        // error of get all entries
        console.error("Find Error :", err)
    })

// get single entry
Demo
    .getEntry('source', 'blt123something')
    .then(function (result) {
        // console.info("Result2 : ", JSON.stringify(result))
        // result object with entry
    })
    .catch(function (err) {
        // error of get entry
        console.error("Fetch Error :", err)
    })