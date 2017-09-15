'use strict'

const ContentstackDemo = require('./contentstack-demo.js')

const Demo = new ContentstackDemo({'api_key': 'blt950d694ee9fce907', 'access_token': 'blt98a76e10ad802238', 'environment': 'development'})

// get all the entries
Demo
    .getEntries('sourcess')
    .then(function (result) {
        console.info("Result1 : ", result)
        // result object with entries
    })
    .catch(function (err) {
        // error of get all entries
        console.error("Find Error :", err)
    })

// get single entry
Demo
    .getEntry('source', 'blte9cab9a80ba36d22')
    .then(function (result) {
        // console.info("Result2 : ", JSON.stringify(result))
        // result object with entry
    })
    .catch(function (err) {
        // error of get entry
        console.error("Fetch Error :", err)
    })