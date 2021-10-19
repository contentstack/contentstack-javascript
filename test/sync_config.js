'use strict';

module.exports = {
    stack: {
        "api_key": "",
        "delivery_token": "",
        "environment": ""
    },
    host: "",
    url: "",
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