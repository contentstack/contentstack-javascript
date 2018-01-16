'use strict'

const ContentstackDemo = require('./contentstack-demo.js')

const Demo = new ContentstackDemo({ 'api_key': 'blt7226fe8124ef0a4a', 'access_token': 'blt6e288386d4a8e18a', 'environment': 'development' })


    // Demo
    // .getEntries()
    // .then(function(result) {
    //     // result object with entry
    //     console.info("Result2 : ", JSON.stringify(result))
    // })
    // .catch(function(err) {
    //     // error of get entry
    //     console.error("Fetch Error :", err)
    // })



    //get all the entries
Demo
    .getEntries('homepage')
    .spread(function(result) {
        // result object with entries
        console.info("Result: ", result)

    })
    .catch(function(err) {
        // error of get all entries
        console.error("Find Error :", err)
    })


