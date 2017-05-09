/**
 * Created by Aamod Pisat on 09-05-2017.
 */
var Contentstack = require('./dist/node/contentstack.js'),
    app = require('express')(app);

var Stack  = Contentstack.Stack({
    "api_key": "bltf9cdecd012ea43cc",
    "access_token": "blte6d3fe16e678f835096754b7",
    "environment": "development"
});

app.get('/', function (req, res, next) {
   Stack
       .ContentType('source')
       .Query()
       .where('title', '')
       .find()
       .then(function (data) {
           if(data) {
               res.send(data);
           }
       }).catch(function (err) {
           console.error("message: ", err);
           res.send(err)
       })
});

app.listen(process.env.PORT || 8000, function () {
    console.error("App is running on port:", (process.env.PORT || 8000));
});


