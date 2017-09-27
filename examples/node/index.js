'use strict'

const ContentstackDemo = require('./contentstack-demo.js')

const Demo = new ContentstackDemo({'api_key': 'blt950d694ee9fce907', 'access_token': 'blt98a76e10ad802238', 'environment': 'development'})

// get all the entries
// Demo
//     .getEntries('source')
//     .spread(function (result) {
//         console.info("Result: ", result)
//         // result object with entries
//     })
//     .catch(function (err) {
//         // error of get all entries
//         console.error("Find Error :", err)
//     // })

// get single entry
// Demo
//     .getEntry('source', 'bltd2c3ab52b53a2a3e')
//     .then(function (result) {
//         console.info("Result2 : ", JSON.stringify(result))
//         // result object with entry
//     })
//     .catch(function (err) {
//         // error of get entry
//         console.error("Fetch Error :", err)
//     })

// get single asset
Demo
    .getAsset('blt210c2968a4a7b5d9')
    .then(function (result) {
        console.info("Result2 : ", result)
        // result object with entry
    })
    .catch(function (err) {
        // error of get entry
        console.error("Fetch Error :", err)
    })