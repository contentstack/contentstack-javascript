#To test follow the steps

 1. make sure the host is set to "stag-api.contentstack.io"

    npm test

#Built.io Contentstack Configuration

        Stack = Contentstack.Stack({
            "api_key": "blt123something",
            "access_token": "blt123something",
            //"environment_uid": "blt123something"
            "environment": "development"
        });


#Run the tests

npm test (to write output to file just follow | tap-json > path-to-file/filename.json)