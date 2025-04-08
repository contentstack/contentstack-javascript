[![Contentstack](https://www.contentstack.com/docs/static/images/contentstack.png)](https://www.contentstack.com/)
## JavaScript Content Delivery SDK for Contentstack

Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. [Read More](https://www.contentstack.com/).

Contentstack provides JavaScript SDK to build application on top of JavaScript. Given below is the detailed guide and helpful resources to get started with our JavaScript SDK.

The JavaScript SDK can also be used to create Node.js and React native applications.

### Prerequisite

You need Node.js version 4.4.7 or later installed to use the Contentstack JavaScript SDK.

### Setup and Installation

#### For JavaScript (Browser)
For browsers, we recommend to download the library via npm or yarn to ensure 100% availability.

If you'd like to use a standalone built file you can use the following script tag or download it from [jsDelivr](https://www.jsdelivr.com/package/npm/contentstack), under the `dist` directory:

```html
<script src="https://cdn.jsdelivr.net/npm/contentstack@latest/dist/web/contentstack.min.js" integrity="12nVcFP1kBh/0Q5rLUvKE34exDRK2DpHUFkGkhRSXTcwGC2PI1D9h64C5arpt5OY" crossorigin="anonymous"></script>
```
You can also specify a specific version number.
```html
<script src="https://cdn.jsdelivr.net/npm/contentstack@3.25.2/dist/web/contentstack.min.js" integrity="fXmq+b/kd2EenBR7APjzzy0hLTOhAhrir3C6HZYZKuF9O+g+HuSIU7Usi8Ccy9I5" crossorigin="anonymous"></script>
```

To initialize the SDK, you will need to specify the API Key, Delivery Token, and Environment Name of your stack.

```javascript
    const Stack = Contentstack.Stack({ "api_key": "api_key", "delivery_token": "delivery_token", "environment": "environment" });
```

For Setting the European Region:
If you want to set and use European region, refer to the code below:

```javascript
    const Stack = Contentstack.Stack({ "api_key": "api_key", "delivery_token": "delivery_token", "environment": "environment", "region": Contentstack.Region.EU });
```

#### For Node.js

Node.js uses the Javascript SDK to create apps. To use the JavaScript SDK, install it via npm:

```bash
npm i contentstack
```

To import the SDK in your project, use the following command:

```javascript
import Contentstack from ‘contentstack’
```

To initialize the SDK, you will need to specify the API Key, Delivery Token, and Environment Name of your stack.

```javascript
    const Stack = Contentstack.Stack({ "api_key": "api_key", "delivery_token": "delivery_token", "environment": "environment" });
```

For Setting the European Region: 

If you want to set and use European region, refer to the code below:

```javascript
    const Stack = Contentstack.Stack({ "api_key": "api_key", "delivery_token": "delivery_token", "environment": "environment", "region": Contentstack.Region.EU });
```

#### For React Native

React Native uses the Javascript SDK to create apps. To use the JavaScript SDK, install it via npm:

```bash
npm i contentstack
```

To import the SDK in your project, use the following command:

```javascript
import Contentstack from `contentstack`
```

To initialize the SDK, you will need to specify the API Key, Delivery Token, and Environment Name of your stack.

```javascript
    const Stack = Contentstack.Stack({ "api_key": "api_key", "delivery_token": "delivery_token", "environment": "environment" });
```

For Setting the European Region:

If you want to set and use European region, refer to the code below:

```javascript
    const Stack = Contentstack.Stack({ "api_key": "api_key", "delivery_token": "delivery_token", "environment": "environment" "region": Contentstack.Region.EU });
```

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

You will need to specify the API key, Delivery Token, and Environment Name of your stack to initialize the SDK:

```javascript
    const Stack = Contentstack.Stack({ "api_key": "api_key", "delivery_token": "delivery_token", "environment": "environment" });
```

Once you have initialized the SDK, you can start getting content in your app.

#### Querying content from your stack

To get a single entry, you need to specify the content type as well as the ID of the entry.

```javascript
const Query = Stack.ContentType('blog').Entry("<entry_uid>");

Query
    .toJSON()
    .fetch()
    .then(function success(entry) {
        console.log(entry.get('title')); // Retrieve field value by providing a field's uid
    }, function error(err) {
        // err object
    })
```

To retrieve multiple entries of a content type, you need to specify the content type uid. You can also specify search parameters to filter results.

```javascript
const Query = Stack.ContentType('blog').Query();

Query
    .where("title", "welcome")
    .includeContentType()
    .includeCount()
    .toJSON()
    .find()
    .then(function success(result) {
        // result is array where -
        // result[0] =&gt; entry objects
        // result[result.length-1] =&gt; entry objects count included only when .includeCount() is queried.
        // result[1] =&gt; schema of the content type is included when .includeContentType() is queried.
    }, function error(err) {
        // err object
    })
```

#### Cache Policies

You can set a cache policy on a stack and/or query object.

##### Setting a cache policy on a stack

This option allows you to globalize a cache policy. This means the cache policy you set will be applied to all the query objects of the stack.

```javascript
//Setting a cache policy on a stack
Stack.setCachePolicy(Contentstack.CachePolicy.NETWORK_ELSE_CACHE)
```

##### Setting a cache policy on a query object

This option allows you to set/override a cache policy on a specific query object.

```javascript
// setting a cache policy on a queryobject
Query.setCachePolicy(Contentstack.CachePolicy.CACHE_THEN_NETWORK)
```

### Advanced Queries

You can query for content types, entries, assets and more using our JavaScript API Reference.

[JavaScript API Reference Doc](https://www.contentstack.com/docs/developers/javascript-browser/api-reference/)

### Working with Images

We have introduced Image Delivery APIs that let you retrieve images and then manipulate and optimize them for your digital properties. It lets you perform a host of other actions such as crop, trim, resize, rotate, overlay, and so on. 

For example, if you want to crop an image (with width as 300 and height as 400), you simply need to append query parameters at the end of the image URL, such as,  https://images.contentstack.io/owl.jpg?crop=300,400. There are several more parameters that you can use for your images.

[Read Image Delivery API documentation](https://www.contentstack.com/docs/developers/apis/image-delivery-api/).

Following are Image Delivery API examples.

```javascript
// set the quality 100 
imageUrl = Stack.imageTransform(imageUrl, {
    'quality': 100
})

// set the quality to 100, auto optimization, width and height
imageUrl = Stack.imageTransform(imageUrl, {
    'quality': 100,
    'auto': 'webp',
    'width': 100,
    'height': 100
})
```

### Using the Sync API with JavaScript SDK

The Sync API takes care of syncing your Contentstack data with your app and ensures that the data is always up-to-date by providing delta updates. Contentstack’s JavaScript SDK supports Sync API, which you can use to build powerful apps. Read through to understand how to use the Sync API with Contentstack JavaScript SDK.
[Read Sync API documentation](https://www.contentstack.com/docs/platforms/javascript-browser#using-the-sync-api-with-javascript-sdk).

> Note: Sync function does not support cache policy. When using the Sync function, we recommend you to set the cache policy to IGNORE_CACHE.
##### Initial sync

The Initial Sync process performs a complete sync of your app data. It returns all the published entries and assets of the specified stack in response.

To start the Initial Sync process, use the syncStack method.

```javascript
let data = Stack.sync({"init": true})
data.then(function(sync_data, err) {
    //error for any error description
    //sync_data.items: contains sync data
    //sync_data.paginationToken: for fetching the next batch of entries using pagination token
    //sync_token.syncToken: for performing subsequent sync after initial sync
    if (err) throw err
})
```
> Note: Sync function does not support cache policy. When using the Sync function, we recommend you to set the cache policy to IGNORE_CACHE.


The response also contains a sync token, which you need to store, since this token is used to get subsequent delta updates later, as shown in the Subsequent Sync section below.

You can also fetch custom results in initial sync by using advanced sync queries.

##### Sync pagination

If the result of the initial sync (or subsequent sync) contains more than 100 records, the response would be paginated. It provides pagination token in the response. You will need to use this token to get the next batch of data.

```javascript
let data = Stack.sync({"pagination_token" : "<pagination_token>"})
data.then(function(result,  err) {
    //error for any error description
    //result.items: contains sync data
    //result.paginationToken: For fetching the next batch of entries using pagination token
    //result.syncToken: For performing subsequent sync after initial sync
    if(err) throw err
})
```

##### Subsequent sync

You can use the sync token (that you receive after initial sync) to get the updated content next time. The sync token fetches only the content that was added after your last sync, and the details of the content that was deleted or updated.

```javascript
let data = Stack.sync({"sync_token" :  “<sync_token>”})
data.then(function(sync_data,  err) {
    //error for any error description
    //sync_data.items: contains sync data
    //sync_data.paginationToken: for fetching the next batch of entries using pagination token
    //sync_token.syncToken: for performing subsequent sync after initial sync
    if(err) throw err
})
```

##### Advanced sync queries

You can use advanced sync queries to fetch custom results while performing initial sync. 
[Read advanced sync queries documentation](https://www.contentstack.com/docs/developers/use-the-sync-apis-with-sdk/use-sync-api-with-javascript-sdk#advanced-sync-queries)

### Helpful Links

- [Contentstack Website](https://www.contentstack.com)
- [Official Documentation](https://contentstack.com/docs)
- [Content Delivery API Docs](https://contentstack.com/docs/apis/content-delivery-api/)

### The MIT License (MIT)

Copyright © 2012-2025 [Contentstack](https://www.contentstack.com). All Rights Reserved

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
