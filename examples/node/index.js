'use strict'

const ContentstackDemo = require('./contentstack-demo.js')

const Demo = new ContentstackDemo({ 'api_key': "", 'access_token': "", 'environment': ""})


    //get all the entries
Demo.getEntries()
    .then(function(result, err) {
       // console.log("Result>>>>>>>>>>>>>>>")   
        try {
            if (err || !result) {
             console.log("Result>>>>>>>>>>>>>>>") 
                console.log(err)
            } else {
                
                console.log("Result: ", JSON.stringify(result, null, 1))
                //console.info("Result: ", JSON.stringify(result))
            }
        } catch (e) {
            return reject(e);
        } 
    })
    .catch(function(err) {
        // error of get all entries
        console.error("Find Error :", err)
    })
