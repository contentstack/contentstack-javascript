/**
 * Created by Aamod Pisat on 09-05-2017.
 */
var Contentstack = require('./dist/node/contentstack'),
    app = require('express')(app);

// var Stack  = Contentstack.Stack({
//         "api_key": "blt9fc7b625627e53be",
//         "access_token": "bltf4a8097118277a6e",
//         "environment": "development"
// });

app.get('/', function (req, res, next) {
  var Stack = Contentstack.Stack({
'api_key': 'blt8ca3003060a25f8a',
'access_token': 'blt460b6594773905171c349a6c',
'environment': "production"
});

var Query = Stack.ContentType('property_events').Query().includeReference('retailer_reference').includeReference('property').includeReference('category_tag');
Query
.ascending('created_at')
.toJSON()
.where('job_fair', true)
.find()
.then(function success(result) {
  res.send(result);
});
    // var Query = Stack.ContentType('source').Query();
   // Stack
   //     .ContentType('source')
   //     .Query()
   //     .except('title')
   //     .find()
   //     .then(function (data) {
   //         if(data) {
   //             res.send(data);
   //         }
   //     }).catch(function (err) {
   //         console.error("message: ", err);
   //         res.send(err)
   //     })

    // Query
    //     .includeReference('reference')
    //     .only('title')
    //     // .except('reference', 'title')
    //     .toJSON().findOne()
    //     .then(function success(entry) {
    //         var flag = false;
    //         if(entry && entry['reference'] && typeof entry['reference'] === 'object') {
    //             flag = entry.reference.every(function(reference) {
    //                 return (reference && !("title" in reference));
    //             });
    //         }
    //         res.send(entry);
    //     }, function error(err) {
    //         console.error("Error :",err);
    //         res.send(err);
    //     });

    // var Query = Stack.ContentType('source').Query().includeReference('retailer_reference').includeReference('property').includeReference('category_tag');
    // Query
    // .ascending('created_at')
    // .toJSON()
    // .where('job_fair', true)
    // .find()
    // .then(function success(result) {
    //   res.send(result);
    // }, function err(err) {
    //   res.send(err);
    // });
});
app.listen(process.env.PORT || 8000, function () {
    console.error("App is running on port:", (process.env.PORT || 8000));
});


