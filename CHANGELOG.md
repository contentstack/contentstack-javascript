## Change log
### Version: 3.26.2
#### Date:  Aug-04-2025
##### Fix:
 - Dependency Updated
 - Lint issues resolved

### Version: 3.26.1
#### Date:  July-28-2025
##### Fix:
 - Cleared unused dependencies
 - Fixed installation warnings

### Version: 3.26.0
#### Date:  July-01-2025
##### Feat:
 - Added AWS-AU support

### Version: 3.25.3
#### Date:  April-21-2025
##### Feat:
 - Handle the sanity tests when ENVs are not provided.

### Version: 3.25.2
#### Date:  April-02-2025
##### Fix:
 - allow number, string, object, boolean, and RegExp as valid query parameters in sync method

### Version: 3.25.1
#### Date:  April-01-2025
##### Feat:
 - Update dependencies
 - Update slack notification

### Version: 3.25.0
#### Date:  March-10-2025
##### Fix:
 - Added GCP-EU support

### Version: 3.24.3
#### Date:  March-03-2025
##### Fix:
 - Using Node v22
 - Fixed license and Semgrep issues

### Version: 3.24.2
#### Date:  Feb-25-2025
##### Fix:
 - Reset Timeline Preview variables

### Version: 3.24.1
#### Date:  February-03-2025
##### Fix:
 - Added HTTP error codes in the findOne method

### Version: 3.24.0
#### Date:  January-27-2025
##### Enhancement:
 - updateasseturl for handling jrte within blocks
 - version bumps
 - Fixed testcases

### Version: 3.23.0
#### Date:  December-05-2024
##### Enhancement:
 - Added HTTP error codes in the findOne method

### Version: 3.22.2
#### Date:  November-18-2024
##### Fix:
 - Handle empty entries

### Version: 3.22.1
#### Date:  October-28-2024
##### Fix:
 - Node version bump

### Version: 3.22.0
#### Date:  October-17-2024
##### Fix:
 - Fixed updateAssetUrl issue
 - Fixed the Github workflow issue
 - Updated the qs version

### Version: 3.21.0
#### Date:  September-09-2024
##### Fix:
 - Feat Variants support added

### Version: 3.20.4
#### Date:  August-14-2024
##### Fix:
 - Fix file upload function in sanity report file

### Version: 3.20.3
#### Date:  August-02-2024
##### HotFix:
 - Removed encode for query params

### Version: 3.20.1
#### Date:  July-09-2024
##### Fix:
 - Type support for LivePreviewQuery method params

### Version: 3.20.0
#### Date:  May-31-2024
##### Enhanncement:
 - Adds Timeline Preview changes

### Version: 3.19.3
#### Date:  May-17-2024
##### Enhanncement:
 - Update Asset URL method added

### Version: 3.19.2
#### Date:  April-17-2024
##### Dependency:
 - Hotfix moving slack/bolt to devDependency

### Version: 3.19.1
#### Date: March-06-2024
##### Dependency:
 - Update Utils SDK dependency version

### Version: 3.19.0
#### Date: February-02-2024
##### New Features:
 - live preview support both 1.0 and 2.0
 - fix for `ESM module cannot use module.exports` issue react-native and nativescript builds
### Version: 3.18.1
#### Date: January-30-2024
##### New Features:
 - added fix for `ESM module cannot use module.exports` issue
### Version: 3.18.0
#### Date: January-15-2024
##### New Features:
 - added taxonomy support
 - X-User-Agent updated
 - added region gcp_na
### Version: 3.17.2
#### Date: November-15-2023
##### Bug fix:
 - Same management token in Live Preview in different stack object fixed
 - X-User-Agent updated
##### New Features
 - Early Access added to stack config

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
