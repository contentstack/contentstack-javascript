## Change log

### Version: 3.17.1
#### Date: April-18-2023
##### Bug fix:
 - Access token for header issue resolved

### Version: 3.17.0
#### Date: March-30-2023
##### Bug fix:
 - Cache set issue resolved
 - Type-definition for SyncResult updated

### Version: 3.16.1
#### Date: February-28-2023
 - Package dependency updated
### Version: 3.16.0
#### Date: February-10-2023
#####  New Features:
 - Plugin Support Added

### Version: 3.15.3
#### Date: July-26-2022
#####  New Features:
 - Live preview with reference in entry on SSR web app issue resolved

### Version: 3.15.2
#### Date: May-03-2022
#####  New Features:
 - Live preview with reference entry issue resolved

### Version: 3.15.1
#### Date: Apr-21-2022
#####  New Features:
 - Azure Na region and packages updates

### Version: 3.15.0
#### Date: Oct-29-2021
#####  New Features:
 - Content branching feature support added


### Version: 3.14.0
#### Date: Oct-19-2021
#####  New Features:
 - Live preview feature support added

### Version: 3.13.2
#### Date: May-26-2021
##### Dependency:
 - Update Utils SDK dependency version
 
### Version: 3.13.1
#### Date: Apr-16-2021
##### Bug fix:
 - IE 11 request method issue resolved
 
### Version: 3.13.0
#### Date: Apr-05-2021

##### Update API:
 - [Query]: Added support for method includeEmbeddedItems
 - [Entry]: Added support for method includeEmbeddedItems
 
### Version: 3.12.2
#### Date: Feb-19-2021

##### API timeout:
- updated timeout to min 30 sec
##### Enhancement Typescript:
- boolean value support added:
  - [Query] - where, equalTo, notEqualTo

### Version: 3.12.1
#### Date: Jan-22-2021

##### Bug fix:
 - Fixed Unhandled promise rejection on HTML response body.
### Version: 3.12.0
#### Date: Dec-05-2020

##### New Features:
 - [Entry] - Publish fallback method added
 - [Query] - Publish fallback method added
 - [Asset] - Publish fallback method added
 - [Assets] - Publish fallback method added

### Version: 3.11.0
#### Date: Sept-25-2020

##### Update API:
 - Retry limit for fetch request 
 - Retry delay options for fetch request
 - Retry on error occur for fetch request
 - Typescript definition added

##### Enhancement Documentation
 - Documentation update for Only and Except


### Version: 3.10.1
#### Date: Jun-29-2020

##### Update API:
 - Include Content-Type in Entry

### Version: 3.10.0
#### Date: Jun-19-2020

##### API timeout:
 - Removed default timeout for request

### Version: 3.9.0
#### Date: Jun-17-2020

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
