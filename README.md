[![Contentstack](https://www.contentstack.com/docs/static/images/contentstack.png)](https://www.contentstack.com/)
## JavaScript SDK for Contentstack

Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. [Read More](https://www.contentstack.com/). 

Contentstack provides JavaScript SDK to build application on top of JavaScript. Given below is the detailed guide and helpful resources to get started with our JavaScript SDK.

The JavaScript SDK can also be used to create Node.js and React native applications. 

### Prerequisite

You need Node.js version 4.4.7 or later installed to use the Contentstack JavaScript SDK.

### Setup and Installation

#### For JavaScript (Browser)

To use the JavaScript SDK, download it from [here](https://contentstack.com/docs/platforms/javascript-browser/javascript_sdk_latest) and include it in the &lt;script&gt; tag:

    <script type="text/javascript" src="/path/to/contentstack.min.js"></script>;

To initialize the SDK, you will need to specify the API Key, Access Token, and Environment Name of your stack.

    const Stack = Contentstack.Stack("api_key", "access_token", "environment_name");

#### For Node.js

Node.js uses the Javascript SDK to create apps. To use the JavaScript SDK, download it from [here](https://contentstack.com/docs/platforms/javascript-browser/javascript_sdk_latest), OR install it via npm:

    npm -i contentstack

To import the SDK in your project, use the following command:

    import contentstack from ‘contentstack’

To initialize the SDK, you will need to specify the API Key, Access Token, and Environment Name of your stack.

    const Stack = Contentstack.Stack("api_key","access_token","environment_name");

#### For React Native

React Native uses the Javascript SDK to create apps. To use the JavaScript SDK, download it from [here](https://contentstack.com/docs/platforms/javascript-browser/javascript_sdk_latest), OR install ist via npm:

    npm -i contentstack

To import the SDK in your project, use the following command:

    import contentstack from `contentstack/react-native`

To initialize the SDK, you will need to specify the API Key, Access Token, and Environment Name of your stack.

    const Stack = Contentstack.Stack("api_key", "access_token", "environment_name");


### Key Concepts for using Contentstack

#### Stack

A stack is like a container that holds the content of your app. Learn more about [Stacks](https://www.contentstack.com/docs/guide/stack).

#### Content Type

Content type lets you define the structure or blueprint of a page or a section of your digital property. It is a form-like page that gives Content Managers an interface to input and upload content. [Read more](https://www.contentstack.com/docs/guide/content-types).

#### Entry

An entry is the actual piece of content created using one of the defined content types. Learn more about [Entries](https://www.contentstack.com/docs/guide/content-management#working-with-entries). 

#### Asset

Assets refer to all the media files (images, videos, PDFs, audio files, and so on) uploaded to Contentstack. These files can be used in multiple entries. Read more about [Assets](https://www.contentstack.com/docs/guide/content-management#working-with-assets). 

#### Environment

A publishing environment corresponds to one or more deployment servers or a content delivery destination where the entries need to be published. Learn how to work with [Environments](https://www.contentstack.com/docs/guide/environments). 

  

### Contentstack JavaScript SDK: 5-minute Quickstart

#### Initializing your SDK 

You will need to specify the API key, Access token, and Environment Name of your stack to initialize the SDK:

    const Stack = Contentstack.Stack("api_key", "access_token", "environment_name");

Once you have initialized the SDK, you can start getting content in your app.

  

#### Querying content from your stack

To get a single entry, you need to specify the content type as well as the ID of the entry.

    const Query = Stack.ContentType('blog').Entry("blt123something");
    
    Query.fetch()
    .then(function success(entry) {
    console.log(entry.get('title')); // Retrieve field value by providing a field's uid
    console.log(entry.toJSON()); // Convert the entry result object to JSON
    }, function error(err) {
    // err object
    });

To retrieve multiple entries of a content type, you need to specify the content type uid. You can also specify search parameters to filter results.

    const Query = Stack.ContentType('blog').Query();

    Query 
    .where("title", "welcome")
    .includeSchema()
    .includeCount()
    .toJSON()
    .find()
    .then(function success(result) {
        // result is array where -
        // result[0] =&gt; entry objects
        // result[result.length-1] =&gt; entry objects count included only when .includeCount() is queried.
        // result[1] =&gt; schema of the content type is included when .includeSchema() is queried.
    }, function error(err) {
    // err object
    });

#### Cache Policies

You can set a cache policy on a stack and/or query object.

##### Setting a cache policy on a stack

This option allows you to globalize a cache policy. This means the cache policy you set will be applied to all the query objects of the stack.

    //Setting a cache policy on a stack    
    Stack.setCachePolicy(Contentstack.CachePolicy.NETWORK_ELSE_CACHE)

##### Setting a cache policy on a query object

This option allows you to set/override a cache policy on a specific query object.

    // setting a cache policy on a queryobject
    Query.setCachePolicy(Contentstack.CachePolicy.CACHE_THEN_NETWORK)

### Advanced Queries

You can query for content types, entries, assets and more using our JavaScript API Reference. 

[JavaScript API Reference Doc](https://contentstack.com/docs/platforms/javascript-browser/api-reference)

### Working with Images

We have introduced Image Delivery APIs that let you retrieve images and then manipulate and optimize them for your digital properties. It lets you perform a host of other actions such as crop, trim, resize, rotate, overlay, and so on. 

For example, if you want to crop an image (with width as 300 and height as 400), you simply need to append query parameters at the end of the image URL, such as, https://images.contentstack.io/v3/assets/blteae40eb499811073/bltc5064f36b5855343/59e0c41ac0eddd140d5a8e3e/download?crop=300,400. There are several more parameters that you can use for your images. 

[Read Image Delivery API documentation](https://www.contentstack.com/docs/apis/image-delivery-api/). 

SDK functions for Image Delivery API coming soon. 

### Helpful Links

- [Contentstack Website](https://www.contentstack.com) 
- [Official Documentation](https://contentstack.com/docs) 
- [Content Delivery API Docs](https://contentstack.com/docs/apis/content-delivery-api/) 

### The MIT License (MIT)

Copyright © 2012-2017 [Built.io](https://www.built.io/). All Rights Reserved

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
