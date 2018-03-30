'use strict'

const ContentstackDemo = require('./contentstack-demo.js')

const Demo = new ContentstackDemo({ 'api_key': 'blt8d737a44501db1d2', 'access_token': 'blt0283a8c8824ca5bb', 'environment': 'mobile' })


 // Demo
 //    .getEntries('content_type_2')
 //    .spread(function(result) {
 //        // result object with entry
 //        console.info("Result2 : ", JSON.stringify(result))
 //    })
 //    .catch(function(err) {
 //        // error of get entry
 //        console.error("Fetch Error :", err)
 //    })



    //get all the entries
// Demo
//     .getEntries('homepage')
//     .spread(function(result) {
//         // result object with entries
//         console.info("Result: ", result)

//     })
//     .catch(function(err) {
//         // error of get all entries
//         console.error("Find Error :", err)
//     })



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



//  get all assets
Demo
    .getSyncApi('init', 'true')
    .then(function(result) {
        // result object with entry
        // console.log("Result2 : ", JSON.stringify(result))
        console.log("Result2 : ", result[0])
        for (let i = 0, _i = result.length; i < _i; i++) {
            // Image optimization
            const imgUrl = Demo.Stack.imageTransform(result[i]['url'], {
                quality: 50,
                format: 'jpg'
            })
            console.log("Image URL : ", imgUrl)
        }
    })
    .catch(function(err) {
        // error of get entry
        console.error("getAssets Fetch Error :", err)
    })    





