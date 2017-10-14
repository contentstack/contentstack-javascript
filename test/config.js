'use strict';
module.exports = {
    stack : {
        "api_key": "api_key",
        "access_token": "access_token",
        "environment": "environment"
    },
    host: "cdn.contentstack.io",
    url: "https://api.contentstack.io/v3",
    runscope: {
    	url: "runscope_url",
    	username: "runscope_username",
    	password: "runscope_password"
    },
    smtp: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
            user: 'your_gmail_username',
            pass: 'your_gmail_password'
        }
    }
}