[![Built.io Contentstack](https://contentstackdocs.built.io/static/images/logo.png)](https://www.built.io/products/contentstack/overview)
# Javascript SDK for Built.io Contentstack
## Prerequisite
We recommend to use node.js version >=4.4.7 to use the Built.io Contentstack SDK.
## Installation
You might need administrator privileges to perform this installation.
```bash
$ npm install contentstack
```
To require the SDK module in your application use the following command.
```bash
$ import * as Contentstack from 'contentstack';
```
## Basic Structure
The structure followed by SDK logically resembles the "Stack" structure on Built.io Contentstack. Once you have done the basic setup explained in the Installation section, you get a Built.io Contentstack object, which can be used to initialize different modules. The initialization process for each module is explained below.
### Stack
To initialize a Stack, you need to provide the required keys and values associated with them.
```bash
const Stack = Contentstack.Stack({"api_key":<<API_KEY>>,"access_token":<<ACCESS_TOKEN>>,"environment":<<ENVIRONMENT_NAME>>});
```
Let us take an example where we try to obtain all entries of the Content Type my_content_type.
```bash
const entry = Stack.ContentType(<<CONTENT_TYPE_UID>>).Query();
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
const entry = Stack.ContentType(<<CONTENT_TYPE_UID>>).Entry(<<ENTRY_UID>>);
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
 - [Official Documentation](https://contentstackdocs.built.io/developer/javascript/quickstart)

### License
Copyright © 2012-2017 [Built.io](https://www.built.io/). All Rights Reserved.