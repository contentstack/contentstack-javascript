### Version: 3.10.1
#### Date: Jun-29-2020

##### Update API:
 - Include Content-Type in Entry

### Version: 3.10.0
#### Date: Jun-19-2020

##### API timeout:
 - Removed default timeout for request

### Version: 3.9.0
#### Date: Jun-19-2020

##### Update API:
 - Allowing support to add a timeout for request.
 - Fetch option added for request.

### Version: 3.8.1
#### Date: Nov-19-2019

##### Update API:
 - [Entry] - Updated in entry module.

### Version: 3.8.0
#### Date: Nov-15-2019

##### New Features:
 - [Stack]: Added support for method getContentType()
##### Update API:
 - [ContentType]: updated method fetch()

### Version: 3.7.1
#### Date: Sept-05-2019

##### New Features:
 - [Stack]: Region support added

### Version: 3.7.0
#### Date: Jul-29-2019

##### New Features:
 - [Query]: Added support for method includeReferenceContentTypeUID
 - [Entry]: Added support for method includeReferenceContentTypeUID


### Version: 3.6.0
#### Date: Apr-12-2019

##### New Features:
 - [Stack]: Added support for method getContentTypes
 - [ContentType]: Added support for method fetch


### Version: 3.5.2
#### Date: Mar-20-2019

##### Hotfix:
 - Locale storage issue resolved


### Version: 3.5.1
#### Date: Feb-18-2019

##### Hotfix:
 - Cache policy issue resolved
 - JS reference doc update


### Version: 3.5.0
#### Date: Oct-26-2018

##### Sync API:
 - [Stack] Added Sync API support

### Version: 3.4.0
#### Date: Jan-10-2018

##### Update API:
 - New addParam() method added.
 - Added support for NativeScript


### Version: 3.3.0
#### Date: Nov-06-2017

##### New API:
 - [Stack] Imagetransform API added
 - Added support for NativeScript

##### Deprecate API:
 - [Query]:
   - findOne
   - includeSchema

### Version: 3.2.0
#### Date: Oct-14-2017

##### New API:
 - [Asset] Image delivery support
    - find 
    - fetch 

### Version: 3.1.1
#### Date: Oct-13-2017

##### Hotfix:
 - Boolean value not working in "where" query
 - only() and includeReference() query not working in reactnative ios

### Version: 3.1.0
#### Date: Apr-28-2017

##### Update API:
 - Code Revamp: ECMA6
 - React Native support added
 - Webpack upgraded

##### Bug fix:
 - Fixed unwanted authtoken appending in embedded assets url in RTE field



### Version: 3.0.1
#### Date: Feb-10-2017

##### Update API:
 - Multiple stacks can be configured rather than a singleton Stack Object

##### Bug fix:
 - Issue with the support for import attribute on client side
