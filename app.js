/**
 * Created by Aamod Pisat on 09-05-2017.
 */
var Contentstack = require('./dist/node/contentstack'),
    app = require('express')(app);

var Stack  = Contentstack.Stack({
    "api_key": "blt920bb7e90248f607",
    "access_token": "blt0c4300391e033d4a59eb2857",
    "environment": "production"
});

app.get('/', function (req, res, next) {
   Stack
       .ContentType('news')
       .Query()
       .only(['title', 'body', 'category'])
       .only('category', 'title')
       .includeReference('category')
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


