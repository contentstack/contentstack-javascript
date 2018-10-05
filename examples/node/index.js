'use strict'

const ContentstackDemo = require('./contentstack-demo.js')

const Demo = new ContentstackDemo({ 'api_key': 'blt3095c4e04a3d69e6', 'access_token': 'bltd4c70163cb65d8e2', 'environment': 'development', 'web_ui_api_key': '607a456d7f3afc20cd9fcb1f' })


 // Demo
 //    .getEntries('home_reference')
 //    .then(function(result) {
 //        // result object with entry
 //        console.info("Result2 : ", typeof result)
        
 //        //console.info("Result2 : ", JSON.stringify(result))

 //    })
 //    .catch(function(err) {
 //        // error of get entry
 //        console.error("Fetch Error :", err)
 //    })



    //get all the entries
Demo.getSyncApi({'init': 'true'})
    .then(function(result) {
        // result object with entries
        console.info("Result: ", result)

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





