#To test follow the steps

 1. make sure the host is set to "stag-api.contentstack.io"

    npm test

#Built.io Contentstack Configuration

        Stack = Contentstack.Stack({
            "api_key": "stack_api_key",
            "access_token": "stack_access_token",
            "environment": "development"
        });


#Run the tests

npm test (to write output to file just follow | tap-json > path-to-file/filename.json)