'use strict';

module.exports = {
    stack: {
        "api_key": "",
        "access_token": "",
        "environment": ""
    },
    host: "cdn.contentstack.io",
    url: "https://api.contentstack.io/v3",
     /*runscope: {
         url: "https://api.runscope.com/radar/76730163-fab9-4554-95c1-7ba75aaa2628/trigger?runscope_environment=1f5114ea-7a2d-4adf-9fd3-abc885c47783",
         username: "<USERNAME>",
         password: "<PASSWORD>"
     },*/
    contentTypes: {
        source: "source",
        numbers_content_type: "numbers_content_type"
    },
    smtp: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: '<USERNAME>',
            pass: '<PASSWORD>'
        }
    }
}
