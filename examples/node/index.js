'use strict'

const ContentstackDemo = require('./contentstack-demo.js')

const Demo = new ContentstackDemo({ 'api_key': 'blt4f29123a87c48c8b', 'access_token': 'bltb77300e99de1ce68', 'environment': 'local'})


 Demo
    .getEntries('generic_template_1')
    .then(function(result) {
        // result object with entry
        console.log("scnjdncjdncjd", result[0][0].getDownloadUrl())
        //console.info("Result2 : ", JSON.stringify(result))

    })
    .catch(function(err) {
        // error of get entry
        console.error("Fetch Error :", err)
    })



    //get all the entries
// Demo.getSyncApi({"init": true, "type": "asset_published"})
//     .then(function(result) {
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





