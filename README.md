[![Built.io Contentstack](https://contentstackdocs.built.io/static/images/logo.png)](https://www.built.io/products/contentstack/overview)
# Javascript SDK for Built.io Contentstack
## Prerequisite
You need to install node.js v0.10.22 or later to use the Built.io Contentstack SDK.
## Installation
You might need administrator privileges to perform this installation.
```bash
$ npm install contentstack
```
To require the SDK module in your application use the following command.
```bash
$ var Contentstack = require('contentstack');
```
## Basic Structure
The structure followed by SDK logically resembles the "Stack" structure on Built.io Contentstack. Once you have done the basic setup explained in the Installation section, you get a Built.io Contentstack object, which can be used to initialize different modules. The initialization process for each module is explained below.
### Stack
To initialize a Stack, you need to provide the required keys and values associated with them.
```bash
var Stack = Contentstack.Stack({"api_key":<<API_KEY>>,"access_token":<<ACCESS_TOKEN>>,"environment":<<ENVIRONMENT_NAME>>});
```
Let us take an example where we try to obtain all entries of the Content Type my_content_type.
```bash
var entry = Stack.ContentType(<<CONTENT_TYPE_UID>>).Query();
entry
  //add query methods here
 .find()
 .then(function(data){
   //data will contain entries from the specified Content Type;
  },function(err){
   //displays a detailed error in case of failure;
  });
```
Let us take another example where we try to obtain only a specific entry from the Content Type my_content_type.
```bash
var entry = Stack.ContentType(<<CONTENT_TYPE_UID>>).Entry(<<ENTRY_UID>>);
entry
  //add query methods here
 .fetch()
 .then(function(data){
   //data will contain the specified entry from the specified Content Type;
  },function(err){
   //displays a detailed error in case of failure;
  });
```
-----

## Links
 - [Website](https://www.built.io/products/contentstack/overview)
 - [Official Documentation](http://contentstackdocs.built.io/developer/javascript/quickstart)

### License
Copyright © 2012-2016 [Built.io](https://www.built.io/). All Rights Reserved.
