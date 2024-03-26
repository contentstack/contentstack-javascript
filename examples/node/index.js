'use strict'
const path = require('path')
const dotenv = require('dotenv').config({
    path: path.join(__dirname, '.env')
})

const ContentstackDemo = require('./contentstack-demo.js')
const Demo = new ContentstackDemo({ 'api_key': process.env.API_KEY, 'delivery_token': process.env.DELIVERY_TOKEN, 'environment': process.env.ENVIRONMENT,  })


    //get all the entries
Demo.getEntries(process.env.CONTENT_TYPE)
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
