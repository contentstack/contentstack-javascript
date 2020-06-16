'use strict'

const ContentstackDemo = require('./contentstack-demo.js')
const Demo = new ContentstackDemo({ 'api_key': 'blt1b0a32d0c621f844', 'delivery_token': 'csaba2e2b6a51971b00ea373ea', 'environment': 'development',  })


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
