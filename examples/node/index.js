'use strict'

const ContentstackDemo = require('./contentstack-demo.js')

//const Demo = new ContentstackDemo({ 'api_key': "blt292960b854e5170e", 'access_token': "blt468d2af41a0f061c", 'environment': "development"})
const Demo = new ContentstackDemo({ 'api_key': "blta18f3e7d09cb530c", 'access_token': "blt5260e2a69bb91bc6", 'environment': "development"})


 // Demo
 //    .getEntries('source')
 //    .then(function(result) {
 //        // result object with entry
 //        console.info("Result2 : ",  result)
        
 //        //console.info("Result2 : ", JSON.stringify(result))

 //    })
 //    .catch(function(err) {
 //        // error of get entry
 //        console.error("Fetch Error :", err)
 //    })



    //get all the entries
Demo.getContentType("header")
    .then(function(err, result) {
        try {
            if (err || !result) {
                console.log(err)
            } else {
                console.info("Result: ", JSON.stringify(result))
            }
        } catch (e) {
            return reject(e);
        } 
    })
    .catch(function(err) {
        // error of get all entries
        console.error("Find Error :", err)
    })

//     // get single asset
// Demo
//     .getAsset('bltsomething123')
//     .then(function(result) {
//         // result object with entry
//         console.info("Result2 : ", result)
//     })
//     .catch(function(err) {
//         // error of get entry
//         console.error("Fetch Error :", err)
//     })



// //  get all assets
// Demo
//     .getAssets()
//     .spread(function(result) {
//         // result object with entry
//         console.info("Result2 : ", result)
//         for (let i = 0, _i = result.length; i < _i; i++) {
//             // Image optimization
//             const imgUrl = Demo.Stack.imageTransform(result[i]['url'], {
//                 quality: 50,
//                 format: 'jpg'
//             })
//             console.log("Image URL : ", imgUrl)
//         }
//     })
//     .catch(function(err) {
//         // error of get entry
//         console.error("getAssets Fetch Error :", err)
//     })    



// get all assets
// Demo
//     .getSyncApi({"sync_token": "blt123something"})
//     .then(function(result) {

//         console.log("result", JSON.stringify(result))
       
//     })
//     .catch(function(err) {
//         // error of get entry
//         console.error("getSync Fetch Error :", err)
//     })    





